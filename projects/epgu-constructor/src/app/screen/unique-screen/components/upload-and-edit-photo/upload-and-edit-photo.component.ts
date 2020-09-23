import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { fromEvent, of, Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DeviceDetectorService } from 'ngx-device-detector';
import { ComponentBase } from '../../../screen.types';
import { ModalService } from '../../../../services/modal/modal.service';
import { PhotoEditorModalComponent } from './photo-editor-modal/photo-editor-modal.component';
import { PhotoErrorModalComponent } from './photo-error-modal/photo-error-modal.component';
import { minCropSize } from './upload-and-edit-photo.constant';
import { ImgSubject } from './upload-and-edit-photo.model';
import { TerraByteApiService } from '../../../../shared/services/terra-byte-api/terra-byte-api.service';
import { WebcamService } from '../../../../shared/services/webcam/webcam.service';
import {
  isCloseAndSaveWebcamEvent,
  WebcamEvent,
} from '../../../../shared/components/webcam-shoot/webcamevents';

@Component({
  selector: 'epgu-constructor-upload-and-edit-photo',
  templateUrl: './upload-and-edit-photo.component.html',
  styleUrls: ['./upload-and-edit-photo.component.scss'],
})
export class UploadAndEditPhotoComponent implements OnInit, OnDestroy {
  @ViewChild('hiddenFileInput') fileInput: ElementRef;

  @Input() data: ComponentBase;
  @Input() isLoading: boolean;
  @Input() header: string;
  @Input() orderId: number;

  @Output() nextStepEvent = new EventEmitter();

  subs = new Subscription();

  /**
   * subjects are needed for opening an error/editor modal window after asynchronous image loading
   */
  imgSubject = new Subject<ImgSubject>();
  imgAttachErrorSubject = new Subject<string[][]>();

  allowedImgTypes: string[];
  isDesktop: boolean;
  isWebcamAvailable: boolean;

  previousImageObjectUrl: string; // keep previous image url if image is changing from modal window
  croppedImageUrl: string;

  fileName: string;
  imageValidator = new Image(); // img container for img validation
  imageUrls: string[] = []; // keeps created image urls for revoking (is used for performance reason)
  urlObj = window.webkitURL || window.URL;

  constructor(
    private deviceService: DeviceDetectorService,
    private modalService: ModalService,
    private terabyteService: TerraByteApiService,
    private webcamService: WebcamService,
  ) {}

  ngOnInit(): void {
    this.addImgSubscriptions();
    this.checkImagePresence();

    this.isDesktop = this.deviceService.isDesktop();
    this.allowedImgTypes = this.data?.attrs?.uploadedFile?.fileType || [];

    if (!this.isDesktop) {
      this.webcamService.isWebcamAllowed().subscribe((isAvailable) => {
        this.isWebcamAvailable = isAvailable;
      });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.imageUrls.forEach((imageObjectUrl) => {
      this.urlObj.revokeObjectURL(imageObjectUrl);
    });
  }

  addImgSubscriptions(): void {
    this.subs
      .add(
        this.imgSubject.subscribe((imageObject) => {
          this.previousImageObjectUrl = imageObject?.imageObjectUrl;
          this.modalService
            .openModal(PhotoEditorModalComponent, imageObject)
            .subscribe((data: { changeImage?: boolean; imageObjectUrl?: string }) => {
              if (data?.changeImage) {
                this.fileInput.nativeElement.click();
              } else if (data?.imageObjectUrl) {
                this.croppedImageUrl = data.imageObjectUrl;
              }
            });
        }),
      )
      .add(
        this.imgAttachErrorSubject.subscribe((imageErrors) =>
          this.modalService
            .openModal(PhotoErrorModalComponent, { imageErrors })
            .subscribe((data: { changeImage?: boolean }) =>
              data?.changeImage ? this.fileInput.nativeElement.click() : null,
            ),
        ),
      )
      .add(fromEvent(this.imageValidator, 'load').subscribe(() => this.validateImage()))
      .add(fromEvent(this.imageValidator, 'error').subscribe(() => this.validateImage()));
  }

  getRequestData(): { mnemonic: string; name: string; objectType: number; objectId: number } {
    const { mnemonic = null, name = null, objectType = 2 } = this.data?.attrs?.uploadedFile;
    return { mnemonic, name, objectType, objectId: this.orderId };
  }

  checkImagePresence(): void {
    const requestData = this.getRequestData();

    if (requestData.mnemonic && requestData.name) {
      this.terabyteService.downloadFile(requestData).subscribe((file: Blob) => {
        const imageObjectUrl = this.urlObj.createObjectURL(file);
        this.imageUrls.push(imageObjectUrl);
        this.croppedImageUrl = imageObjectUrl;
        this.previousImageObjectUrl = imageObjectUrl;
      });
    }
  }

  validateImage(): void {
    const imageType = (this.fileName || '').split('.').pop();
    const { width, height, src } = this.imageValidator;

    const isTypeValid = this.allowedImgTypes.some(
      (allowedType) => allowedType.toLowerCase() === imageType.toLowerCase(),
    );
    const isSizeValid =
      (width >= minCropSize.width && height >= minCropSize.height) ||
      (width >= minCropSize.height && height >= minCropSize.width);

    if (isTypeValid && isSizeValid) {
      this.imgSubject.next({ imageObjectUrl: src });
      return;
    }
    const imageErrors = [];
    if (!isTypeValid) {
      imageErrors.push(['fileType', this.allowedImgTypes.join(', ')]);
    }
    if (!isSizeValid && width && height) {
      imageErrors.push(['size']);
    }
    if (!imageErrors.length) {
      imageErrors.push(['common']);
    }
    if (this.previousImageObjectUrl) {
      this.imgSubject.next({ imageObjectUrl: this.previousImageObjectUrl, imageErrors });
    } else {
      this.imgAttachErrorSubject.next(imageErrors);
    }
  }

  getAcceptTypes(): string {
    return this.allowedImgTypes
      .map((fileType) => `.${fileType}`)
      .join(',')
      .toLowerCase();
  }

  onFileSelected(fileList: FileList, fileInput?: HTMLInputElement): void {
    if (fileList?.length) {
      this.setFile(fileList[0]);
    }
    if (fileInput) {
      // eslint-disable-next-line no-param-reassign
      fileInput.value = '';
    }
  }

  setFile(file: File): void {
    this.fileName = file.name;
    const imageObjectUrl = this.urlObj.createObjectURL(file);
    this.imageUrls.push(imageObjectUrl);
    this.imageValidator.src = imageObjectUrl;
  }

  takePhoto(): void {
    this.webcamService.open().events.subscribe((event: WebcamEvent) => {
      if (isCloseAndSaveWebcamEvent(event)) {
        this.imgSubject.next({ imageObjectUrl: event.data });
      }
      this.webcamService.close();
    });
  }

  changeCroppedPhoto(): void {
    this.imgSubject.next({ imageObjectUrl: this.previousImageObjectUrl });
  }

  nextStep() {
    const imageForUpload = TerraByteApiService.base64toBlob(this.croppedImageUrl);
    let requestData = this.getRequestData();

    of(requestData.name)
      .pipe(
        switchMap((fileName) =>
          fileName ? this.terabyteService.deleteFile(requestData) : of(null),
        ),
        switchMap(() => {
          requestData = { ...requestData, name: this.fileName };
          return this.terabyteService.uploadFile(requestData, imageForUpload);
        }),
      )
      .subscribe(() => {
        this.nextStepEvent.emit(JSON.stringify(requestData));
      });
  }
}
