import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, Observable, of, Subject, Subscription } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '../../../../core/services/config/config.service';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DeviceDetectorService } from '../../../../core/services/device-detector/device-detector.service';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import {
  ComponentDto,
  ComponentUploadedFileDto,
} from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModal } from '../../../../modal/confirmation-modal/confirmation-modal.interface';
import { ModalService } from '../../../../modal/modal.service';
import { ScreenService } from '../../../../screen/screen.service';
import { TerraByteApiService } from '../../services/terra-byte-api/terra-byte-api.service';
import { WebcamService } from '../../services/webcam/webcam.service';
import { TerraUploadedFile } from '../file-upload-screen/sub-components/file-upload-item/data';
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
import { TerabyteListItem } from '../../services/terra-byte-api/terra-byte-api.types';
import { ImgSubject } from './upload-and-edit-photo.model';

@Component({
  selector: 'epgu-constructor-upload-and-edit-photo',
  templateUrl: './upload-and-edit-photo.component.html',
  styleUrls: ['./upload-and-edit-photo.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadAndEditPhotoComponent implements OnInit, OnDestroy {
  @ViewChild('hiddenFileInput') fileInput: ElementRef;
  @ViewChild('cameraInput', {
    static: true,
  })
  cameraInput: ElementRef;

  data: ComponentDto;
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

  storedImageObjectUrl: string;
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
    private utils: UtilsService,
    public screenService: ScreenService,
    public config: ConfigService,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {
    this.header = screenService.header;
    this.data = { ...screenService.component };
    this.orderId = screenService.orderId;
  }

  ngOnInit(): void {
    this.addImgSubscriptions();
    this.checkImagePresence();
    this.setHowPhotoModalParams();

    this.eventBusService
      .on('fileDropped')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileList) => {
        this.onFileSelected(payload);
        this.changeDetectionRef.markForCheck();
      });

    this.isDesktop = this.deviceDetector.isDesktop;
    this.allowedImgTypes = this.data?.attrs?.uploadedFile?.fileType || [];
    this.fileName = this.data?.attrs?.uploadedFile?.name || '';

    if (!this.isDesktop) {
      this.webcamService.isWebcamAllowed().subscribe((isAvailable) => {
        this.isWebcamAvailable = isAvailable;
        this.changeDetectionRef.markForCheck();
      });
    }
  }
  /**
   * Открытие камеры для получения изображения и последующей загрузки
   */
  openCamera(): void {
    this.cameraInput.nativeElement.click();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setHowPhotoModalParams(): void {
    this.howPhotoModalParameters = {
      text: this.data?.attrs?.clarifications[uploadPhotoElemId.howToTakePhoto]?.text || '',
      elemEventHandlers: [
        {
          elemId: uploadPhotoElemId.requirements,
          event: 'click',
          handler(): void {
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
          this.changeDetectionRef.markForCheck();
        });
    });
  }

  imgAttachErrorSub(): Subscription {
    return this.imgAttachErrorSubject.subscribe((imageErrors) =>
      this.modalService
        .openModal(PhotoErrorModalComponent, { imageErrors })
        .subscribe((data: { changeImage?: boolean }) => {
          if (data?.changeImage) {
            this.fileInput.nativeElement.click();
          }
          this.changeDetectionRef.markForCheck();
        }),
    );
  }

  addImgSubscriptions(): void {
    this.subs
      .add(this.imgSub())
      .add(this.imgAttachErrorSub())
      .add(
        fromEvent(this.imageValidator, 'load').subscribe(() => {
          this.validateImage();
          this.changeDetectionRef.markForCheck();
        }),
      )
      .add(
        fromEvent(this.imageValidator, 'error').subscribe(() => {
          this.validateImage();
          this.changeDetectionRef.markForCheck();
        }),
      );
  }

  getRequestData(): ComponentUploadedFileDto {
    const { mnemonic = null, name = null, objectType = 2 } = this.data?.attrs?.uploadedFile;
    return { mnemonic, name, objectType, objectId: this.orderId, mimeType: 'image/jpeg' };
  }

  setImageUrl(imageUrl: string): void {
    this.storedImageObjectUrl = imageUrl;
    this.croppedImageUrl = imageUrl;
    this.previousImageObjectUrl = imageUrl;
    this.changeDetectionRef.markForCheck();
  }

  checkImagePresence(): void {
    const requestData = this.getRequestData();

    if (requestData.mnemonic && requestData.name) {
      this.terabyteService.downloadFile(requestData).subscribe((file: Blob | File) => {
        this.blobToDataURL(file, this.setImageUrl.bind(this));
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

    if (this.storedImageObjectUrl) {
      this.imgSubject.next({ imageObjectUrl: this.previousImageObjectUrl, imageErrors });
    } else {
      this.setImageUrl(this.storedImageObjectUrl);
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

  // TODO сделать перегрузку метода чтобы избавиться от any в шаблоне
  onFileSelected(fileList: FileList, fileInput?: HTMLInputElement, isPhoto: boolean = false): void {
    if (fileList?.length && !this.isModalOpened) {
      this.setFile(fileList[0], isPhoto);
    }
    if (fileInput) {
      // eslint-disable-next-line no-param-reassign
      fileInput.value = '';
    }
  }

  blobToDataURL(file: Blob | File, callback: Function): void {
    const fileReader = new FileReader();
    fileReader.onload = (e): Function => callback(e.target.result.toString());
    fileReader.readAsDataURL(file);
  }

  validateImageEvent(imageUrl: string): void {
    this.imageValidator.src = imageUrl;
  }

  setFile(file: File, isPhoto: boolean): void {
    if (isPhoto) {
      this.fileName = this.utils.cyrillicToLatin(`Фото_${uuidv4()}.jpg`);
    } else {
      this.fileName = this.fixFileName(file);
    }
    this.blobToDataURL(file, (url: string) => this.validateImageEvent(url));
  }

  /**
   * Для браузера Mi фиксит ошибку с двумя точками в названии файла.
   * @param file
   */
  fixFileName(file: File): string {
    if (this.deviceDetector.isMiAndroid()) {
      const extension = file.name.split('.').pop();
      return file.name.replace(`..${extension}`, `.${extension}`);
    }

    return file.name;
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
      this.changeDetectionRef.markForCheck();
    });
  }

  openHowPhotoModal(): void {
    this.modalService
      .openModal(ConfirmationModalComponent, this.howPhotoModalParameters)
      .subscribe((value) => {
        if (value === uploadPhotoElemId.requirements) {
          this.openRequirementsModal();
        }
        this.changeDetectionRef.markForCheck();
      });
  }

  nextStep(): void {
    let requestData = this.getRequestData();

    const deletePrevImage = (fileName: string): Observable<TerraUploadedFile> =>
      fileName
        ? this.terabyteService.deleteFile(requestData).pipe(catchError(() => of(null)))
        : of(null);
    const compressFile = (): Observable<Blob | File> => {
      const blobFile = TerraByteApiService.base64toBlob(this.croppedImageUrl);
      return fromPromise(this.compressionService.imageCompression(blobFile, { maxSizeMB: 5 }));
    };
    const uploadFile = (file: Blob | File): Observable<void> => {
      const fileName = this.fileName.split('.');
      fileName[fileName.length - 1] = 'jpg';
      const name = this.utils.cyrillicToLatin(fileName.join('.'));
      requestData = { ...requestData, name };
      return this.terabyteService.uploadFile(requestData, file);
    };

    of(requestData.name)
      .pipe(
        switchMap((fileName) => deletePrevImage(fileName)),
        switchMap(() => compressFile()),
        switchMap((compressedFile) => uploadFile(compressedFile)),
        switchMap(() => this.terabyteService.getFileInfo(requestData)),
      )
      .subscribe((terraFile: TerabyteListItem) => {
        const mergedData = { ...requestData, ...terraFile };
        this.eventBusService.emit('nextStepEvent', JSON.stringify(mergedData));
        this.changeDetectionRef.markForCheck();
      });
  }
}
