import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { fromEvent, Observable, of, Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
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
import { CompressionService } from '../../../../services/utils/compression.service';
import { ConfigService } from '../../../../config/config.service';
import { ScreenService } from '../../../screen.service';

@Component({
  selector: 'epgu-constructor-upload-and-edit-photo',
  templateUrl: './upload-and-edit-photo.component.html',
  styleUrls: ['./upload-and-edit-photo.component.scss'],
})
export class UploadAndEditPhotoComponent implements OnInit, OnDestroy {
  @ViewChild('hiddenFileInput') fileInput: ElementRef;

  @Output() nextStepEvent = new EventEmitter();

  data: ComponentBase;
  isLoading: Observable<boolean>;
  header: string;
  orderId: number;

  subs = new Subscription();

  /**
   * subjects are needed for opening an error/editor modal window after asynchronous image loading
   */
  imgSubject = new Subject<ImgSubject>();
  imgAttachErrorSubject = new Subject<string[][]>();

  allowedImgTypes: string[];
  isDesktop: boolean;
  isWebcamAvailable: boolean;
  isModalOpened: boolean; // flag is for keeping one modal instance opened

  previousImageObjectUrl: string; // keep previous image url if image is changing from modal window
  croppedImageUrl: string;

  fileName: string;
  imageValidator = new Image(); // img container for img validation

  constructor(
    private deviceService: DeviceDetectorService,
    private modalService: ModalService,
    private terabyteService: TerraByteApiService,
    private webcamService: WebcamService,
    private compressionService: CompressionService,
    private screenService: ScreenService,
    public config: ConfigService,
  ) {
    this.header = screenService.header;
    this.data = { ...screenService.display.components[0] };
    this.isLoading = screenService.isLoading$;
    this.orderId = screenService.orderId;
  }

  ngOnInit(): void {
    this.addImgSubscriptions();
    this.checkImagePresence();

    this.isDesktop = this.deviceService.isDesktop();
    this.allowedImgTypes = this.data?.attrs?.uploadedFile?.fileType || [];
    this.fileName = this.data?.attrs?.uploadedFile?.name || '';

    if (!this.isDesktop) {
      this.webcamService.isWebcamAllowed().subscribe((isAvailable) => {
        this.isWebcamAvailable = isAvailable;
      });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  imgSub(): Subscription {
    return this.imgSubject.subscribe((imageObject) => {
      this.previousImageObjectUrl = imageObject?.imageObjectUrl;
      this.isModalOpened = true;
      this.modalService
        .openModal(PhotoEditorModalComponent, imageObject)
        .subscribe((data: { changeImage?: boolean; imageObjectUrl?: string }) => {
          if (data?.changeImage) {
            this.fileInput.nativeElement.click();
          } else if (data?.imageObjectUrl) {
            this.croppedImageUrl = data.imageObjectUrl;
          }
          this.isModalOpened = false;
        });
    });
  }

  imgAttachErrorSub(): Subscription {
    return this.imgAttachErrorSubject.subscribe((imageErrors) =>
      this.modalService
        .openModal(PhotoErrorModalComponent, { imageErrors })
        .subscribe((data: { changeImage?: boolean }) =>
          data?.changeImage ? this.fileInput.nativeElement.click() : null,
        ),
    );
  }

  addImgSubscriptions(): void {
    this.subs
      .add(this.imgSub())
      .add(this.imgAttachErrorSub())
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
      this.terabyteService.downloadFile(requestData).subscribe((file: Blob | File) => {
        // @ts-ignore
        const setImageUrl = (imageUrl: string) => {
          this.croppedImageUrl = imageUrl;
          this.previousImageObjectUrl = imageUrl;
        };
        this.blobToDataURL(file, setImageUrl);
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

    const imageErrors = this.getImageError(isSizeValid, isTypeValid, width, height);

    if (this.previousImageObjectUrl) {
      this.imgSubject.next({ imageObjectUrl: this.previousImageObjectUrl, imageErrors });
    } else {
      this.imgAttachErrorSubject.next(imageErrors);
    }
  }

  getImageError(
    isSizeValid: boolean,
    isTypeValid: boolean,
    width: number,
    height: number,
  ): string[][] {
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
    return imageErrors;
  }

  getAcceptTypes(): string {
    return this.allowedImgTypes
      .map((fileType) => `.${fileType}`)
      .join(',')
      .toLowerCase();
  }

  onFileSelected(fileList: FileList, fileInput?: HTMLInputElement): void {
    if (fileList?.length && !this.isModalOpened) {
      this.setFile(fileList[0]);
    }
    if (fileInput) {
      // eslint-disable-next-line no-param-reassign
      fileInput.value = '';
    }
  }

  blobToDataURL(file: Blob | File, callback: Function) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => callback(e.target.result.toString());
    fileReader.readAsDataURL(file);
  }

  validateImageEvent(imageUrl: string): void {
    this.imageValidator.src = imageUrl;
  }

  setFile(file: File): void {
    this.fileName = file.name;
    this.blobToDataURL(file, (url: string) => this.validateImageEvent(url));
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
    let requestData = this.getRequestData();

    const deletePrevImage = (fileName: string) =>
      fileName ? this.terabyteService.deleteFile(requestData) : of(null);
    const compressFile = () => {
      const blobFile = TerraByteApiService.base64toBlob(this.croppedImageUrl, 'image');
      return fromPromise(this.compressionService.imageCompression(blobFile, { maxSizeMB: 5 }));
    };
    const uploadFile = (file: Blob | File) => {
      requestData = { ...requestData, name: this.fileName };
      return this.terabyteService.uploadFile(requestData, file);
    };

    of(requestData.name)
      .pipe(
        switchMap((fileName) => deletePrevImage(fileName)),
        switchMap(() => compressFile()),
        switchMap((compressedFile) => uploadFile(compressedFile)),
      )
      .subscribe(() => this.nextStepEvent.emit(JSON.stringify(requestData)));
  }
}
