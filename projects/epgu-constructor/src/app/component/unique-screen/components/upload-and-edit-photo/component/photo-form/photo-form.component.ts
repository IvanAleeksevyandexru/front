import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { v4 as uuidv4 } from 'uuid';
import { DeviceDetectorService } from '../../../../../../core/services/device-detector/device-detector.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { UtilsService } from '../../../../../../core/services/utils/utils.service';
import { ComponentUploadedFileDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { ModalService } from '../../../../../../modal/modal.service';
import { TerraByteApiService } from '../../../../services/terra-byte-api/terra-byte-api.service';
import { WebcamService } from '../../../../services/webcam/webcam.service';
import { PhotoEditorModalComponent } from '../photo-editor-modal/photo-editor-modal.component';
import { PhotoErrorModalComponent } from '../photo-error-modal/photo-error-modal.component';
import { ImgSubject } from '../../upload-and-edit-photo.model';
import { ValidationService } from '../../service/validation/validation.service';
import { UploadService } from '../../service/upload/upload.service';

@Component({
  selector: 'epgu-constructor-photo-form',
  templateUrl: './photo-form.component.html',
  styleUrls: ['./photo-form.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoFormComponent implements OnChanges, OnInit {
  @Input() staticDomainAssetsPath: string;
  @Input() uploadedFile: ComponentUploadedFileDto;
  @Input() fileName: string;
  @Input() orderId: string;
  @Input() allowedImgTypes: string[];
  @Input() startToUploadPhoto: { isStart: boolean };
  @Input() startToChangeCroppedImageUrl: { isStart: boolean };
  @Output() uploadPhotoToServerEvent = new EventEmitter<ComponentUploadedFileDto>();
  @Output() croppedImageUrlEvent = new EventEmitter<string>();

  @ViewChild('hiddenFileInput') fileInput: ElementRef;
  @ViewChild('cameraInput', { static: true }) cameraInput: ElementRef;

  /**
   * subjects are needed for opening an error/editor modal window after asynchronous image loading
   */
  img$ = new Subject<ImgSubject>();
  imgAttachError$ = new Subject<string[][]>();

  isDesktop: boolean;
  isWebcamAvailable: boolean;
  isModalOpened: boolean; // flag is for keeping one modal instance opened

  storedImageObjectUrl: string;
  previousImageObjectUrl: string; // keep previous image url if image is changing from modal window
  croppedImageUrl: string;

  imageValidator = new Image(); // img container for img validation

  constructor(
    private deviceDetector: DeviceDetectorService,
    private modalService: ModalService,
    private terabyteService: TerraByteApiService,
    private webcamService: WebcamService,
    private utils: UtilsService,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
    private validationService: ValidationService,
    private uploadService: UploadService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.startToUploadPhoto?.currentValue.isStart) {
      this.uploadPhotoToServer();
    }

    if (changes.startToChangeCroppedImageUrl?.currentValue.isStart) {
      this.changeCroppedPhoto();
    }
  }

  ngOnInit(): void {
    this.subscribeToImageValidator();
    this.subscribeToImg();
    this.subscribeToImgAttachError();
    this.checkImagePresence();

    this.eventBusService
      .on('fileDropped')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileList) => {
        this.onFileSelected(payload);
        this.changeDetectionRef.markForCheck();
      });

    this.isDesktop = this.deviceDetector.isDesktop;

    if (!this.isDesktop) {
      this.webcamService
        .isWebcamAllowed()
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((isAvailable) => {
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

  subscribeToImg(): void {
    this.img$.subscribe((imageObject) => {
      this.previousImageObjectUrl = imageObject?.imageObjectUrl;
      this.isModalOpened = true;
      this.modalService
        .openModal<{ changeImage?: boolean; imageObjectUrl?: string }>(
          PhotoEditorModalComponent,
          imageObject,
        )
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((data) => {
          if (data?.changeImage) {
            this.fileInput.nativeElement.click();
          } else if (data?.imageObjectUrl) {
            this.croppedImageUrl = data.imageObjectUrl;
            this.croppedImageUrlEvent.emit(this.croppedImageUrl);
          }
          this.isModalOpened = false;
          this.changeDetectionRef.markForCheck();
        });
    });
  }

  subscribeToImgAttachError(): void {
    this.imgAttachError$.subscribe((imageErrors) =>
      this.modalService
        .openModal<{ changeImage?: boolean }>(PhotoErrorModalComponent, { imageErrors })
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((data) => {
          if (data?.changeImage) {
            this.fileInput.nativeElement.click();
          }
          this.changeDetectionRef.markForCheck();
        }),
    );
  }

  subscribeToImageValidator(): void {
    merge(fromEvent(this.imageValidator, 'load'), fromEvent(this.imageValidator, 'error'))
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.validateImage();
        this.changeDetectionRef.markForCheck();
      });
  }

  getRequestData(): ComponentUploadedFileDto {
    const { mnemonic = null, name = null, objectType = 2 } = this.uploadedFile;
    return { mnemonic, name, objectType, objectId: this.orderId, mimeType: 'image/jpeg' };
  }

  setImageUrl(imageUrl: string): void {
    this.storedImageObjectUrl = imageUrl;
    this.croppedImageUrl = imageUrl;
    this.previousImageObjectUrl = imageUrl;
    this.croppedImageUrlEvent.emit(this.croppedImageUrl);
    this.changeDetectionRef.markForCheck();
  }

  checkImagePresence(): void {
    const requestData = this.getRequestData();

    if (requestData.mnemonic && requestData.name) {
      this.terabyteService
        .downloadFile(requestData)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((file: Blob | File) => {
          this.blobToDataURL(file, this.setImageUrl.bind(this));
        });
    }
  }

  validateImage(): void {
    const { width, height, src } = this.imageValidator;

    const { isTypeValid, isSizeValid, isDPIValid } = this.validationService.validateImage(
      this.fileName,
      this.allowedImgTypes,
      width,
      height,
    );

    if (isTypeValid && isSizeValid && isDPIValid) {
      this.img$.next({ imageObjectUrl: src });
      return;
    }

    const imageErrors = this.validationService.getImageError(
      isSizeValid,
      isTypeValid,
      isDPIValid,
      width,
      height,
      this.allowedImgTypes,
    );

    if (this.storedImageObjectUrl) {
      this.img$.next({ imageObjectUrl: this.previousImageObjectUrl, imageErrors });
    } else {
      this.setImageUrl(this.storedImageObjectUrl);
      this.imgAttachError$.next(imageErrors);
    }
  }

  getAcceptTypes(): string {
    return this.allowedImgTypes
      .map((fileType) => `.${fileType}`)
      .join(',')
      .toLowerCase();
  }

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
      this.fileName = this.fixFileName(file.name);
    }
    this.blobToDataURL(file, (url: string) => this.validateImageEvent(url));
  }

  /**
   * Для браузера Mi фиксит ошибку с двумя точками в названии файла.
   * @param fileName
   */
  fixFileName(fileName: string): string {
    if (this.deviceDetector.isMiAndroid()) {
      const extension = fileName.split('.').pop();
      return fileName.replace(`..${extension}`, `.${extension}`);
    }

    return fileName;
  }

  changeCroppedPhoto(): void {
    this.img$.next({ imageObjectUrl: this.previousImageObjectUrl });
    this.startToChangeCroppedImageUrl.isStart = false;
  }

  uploadPhotoToServer(): void {
    const requestData = this.getRequestData();
    this.uploadService
      .uploadPhotoToServer(this.fileName, requestData, this.croppedImageUrl)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((terraFile) => {
        this.uploadPhotoToServerEvent.emit(terraFile);
        this.startToUploadPhoto.isStart = false;
        this.changeDetectionRef.markForCheck();
      });
  }
}
