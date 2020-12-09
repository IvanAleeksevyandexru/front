import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent, of, Subject, Subscription } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '../../../../core/config/config.service';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DeviceDetectorService } from '../../../../core/services/device-detector/device-detector.service';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModal } from '../../../../modal/confirmation-modal/confirmation-modal.interface';
import { ModalService } from '../../../../modal/modal.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase } from '../../../../screen/screen.types';
import {
  isCloseAndSaveWebcamEvent,
  WebcamEvent,
} from '../../../../shared/components/webcam-shoot/webcamevents';
import { TerraByteApiService } from '../../../../shared/services/terra-byte-api/terra-byte-api.service';
import { WebcamService } from '../../services/webcam/webcam.service';
import { CompressionService } from './compression/compression.service';
import { PhotoEditorModalComponent } from './photo-editor-modal/photo-editor-modal.component';
import { PhotoErrorModalComponent } from './photo-error-modal/photo-error-modal.component';
import { PhotoRequirementsModalComponent } from './photo-requirements-modal/photo-requirements-modal.component';
import {
  minSize,
  printImgPx,
  recommendedDPI,
  uploadPhotoElemId,
} from './upload-and-edit-photo.constant';
import { ImgSubject } from './upload-and-edit-photo.model';

@Component({
  selector: 'epgu-constructor-upload-and-edit-photo',
  templateUrl: './upload-and-edit-photo.component.html',
  styleUrls: ['./upload-and-edit-photo.component.scss'],
})
export class UploadAndEditPhotoComponent implements OnInit, OnDestroy {
  @ViewChild('hiddenFileInput') fileInput: ElementRef;

  @Output() nextStepEvent = new EventEmitter();

  data: ComponentBase;
  header: string;
  orderId: string;

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

  howPhotoModalParameters: ConfirmationModal;

  constructor(
    private deviceDetector: DeviceDetectorService,
    private modalService: ModalService,
    private terabyteService: TerraByteApiService,
    private webcamService: WebcamService,
    private compressionService: CompressionService,
    public screenService: ScreenService,
    public config: ConfigService,
  ) {
    this.header = screenService.header;
    this.data = { ...screenService.display.components[0] };
    this.orderId = screenService.orderId;
  }

  ngOnInit(): void {
    this.addImgSubscriptions();
    this.checkImagePresence();
    this.setHowPhotoModalParams();

    this.isDesktop = this.deviceDetector.isDesktop;
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

  setHowPhotoModalParams() {
    this.howPhotoModalParameters = {
      text: this.data?.attrs?.clarifications[uploadPhotoElemId.howToTakePhoto]?.text || '',
      elemEventHandlers: [
        {
          elemId: uploadPhotoElemId.requirements,
          event: 'click',
          handler() {
            this.modalResult.next(uploadPhotoElemId.requirements);
            this.closeModal();
          },
        },
      ],
      title: 'Как сделать фото',
    };
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

  getRequestData(): {
    mnemonic: string;
    name: string;
    objectType: number;
    objectId: string;
    mimeType: string;
  } {
    const { mnemonic = null, name = null, objectType = 2 } = this.data?.attrs?.uploadedFile;
    return { mnemonic, name, objectType, objectId: this.orderId, mimeType: 'image/jpeg' };
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
    const isDPIValid = (): boolean => {
      const scaleFactor = printImgPx.height / height;
      const scaledDPI = Math.ceil(recommendedDPI / scaleFactor);
      return scaledDPI >= recommendedDPI;
    };

    const isTypeValid = this.allowedImgTypes.some(
      (allowedType) => allowedType.toLowerCase() === imageType.toLowerCase(),
    );
    const isSizeValid =
      (width >= minSize.width && height >= minSize.height) ||
      (width >= minSize.height && height >= minSize.width);

    if (isTypeValid && isSizeValid && isDPIValid()) {
      this.imgSubject.next({ imageObjectUrl: src });
      return;
    }

    const imageErrors = this.getImageError(isSizeValid, isTypeValid, isDPIValid(), width, height);

    if (this.previousImageObjectUrl) {
      this.imgSubject.next({ imageObjectUrl: this.previousImageObjectUrl, imageErrors });
    } else {
      this.imgAttachErrorSubject.next(imageErrors);
    }
  }

  getImageError(
    isSizeValid: boolean,
    isTypeValid: boolean,
    isDPIValid: boolean,
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
    if (!isDPIValid) {
      imageErrors.push(['dpi']);
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
        this.fileName = `Фото_${uuidv4()}.jpg`;
        this.imgSubject.next({ imageObjectUrl: event.data });
      }
      this.webcamService.close();
    });
  }

  changeCroppedPhoto(): void {
    this.imgSubject.next({ imageObjectUrl: this.previousImageObjectUrl });
  }

  handleClickOnElemById($event: Event): void {
    const targetElementId = ($event.target as HTMLElement).id;
    if (targetElementId === uploadPhotoElemId.howToTakePhoto) {
      this.openRequirementsModal();
    }
    if (targetElementId === uploadPhotoElemId.requirements) {
      this.openHowPhotoModal();
    }
  }

  openRequirementsModal(): void {
    const { setting = {} } = this.data?.attrs?.clarifications[uploadPhotoElemId.requirements];
    this.modalService.openModal(PhotoRequirementsModalComponent, { setting }).subscribe((value) => {
      if (value === uploadPhotoElemId.howToTakePhoto) {
        this.openHowPhotoModal();
      }
    });
  }

  openHowPhotoModal(): void {
    this.modalService
      .openModal(ConfirmationModalComponent, this.howPhotoModalParameters)
      .subscribe((value) => {
        if (value === uploadPhotoElemId.requirements) {
          this.openRequirementsModal();
        }
      });
  }

  nextStep(): void {
    let requestData = this.getRequestData();

    const deletePrevImage = (fileName: string) =>
      fileName
        ? this.terabyteService.deleteFile(requestData).pipe(catchError(() => of(null)))
        : of(null);
    const compressFile = () => {
      const blobFile = TerraByteApiService.base64toBlob(this.croppedImageUrl);
      return fromPromise(this.compressionService.imageCompression(blobFile, { maxSizeMB: 5 }));
    };
    const uploadFile = (file: Blob | File) => {
      const fileName = this.fileName.split('.');
      fileName[fileName.length - 1] = 'jpg';
      requestData = { ...requestData, name: fileName.join('.') };
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
