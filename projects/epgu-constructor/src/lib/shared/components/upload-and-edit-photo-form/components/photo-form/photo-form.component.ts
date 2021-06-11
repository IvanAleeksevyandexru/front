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
import { switchMap, takeUntil } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { ComponentUploadedFileDto, ComponentValidationDto } from '@epgu/epgu-constructor-types';
import {
  ModalService,
  EventBusService,
  DeviceDetectorService,
  UnsubscribeService,
  UtilsService,
} from '@epgu/epgu-constructor-ui-kit';

import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { WebcamService } from '../../../../../core/services/webcam/webcam.service';
import { PhotoEditorModalComponent } from '../photo-editor-modal/photo-editor-modal.component';
import { PhotoErrorModalComponent } from '../photo-error-modal/photo-error-modal.component';
import { ValidationService } from '../../service/validation/validation.service';
import { UploadService } from '../../service/upload/upload.service';
import { ImgSubject } from '../../upload-and-edit-photo-form.model';

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
  @Input() orderId: number;
  @Input() allowedImgTypes: string[];
  @Input() startToUploadPhoto: { isStart: boolean };
  @Input() startToChangeCroppedImageUrl: { isStart: boolean };
  @Input() validations: Array<ComponentValidationDto>;
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
  acceptType: string;
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
    this.acceptType = this.getAcceptType();

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
  public openCamera(): void {
    this.cameraInput.nativeElement.click();
  }

  public onFileSelected(
    fileList: FileList,
    fileInput?: HTMLInputElement,
    isPhoto: boolean = false,
  ): void {
    if (fileList?.length && !this.isModalOpened) {
      this.setFile(fileList[0], isPhoto);
    }
    if (fileInput) {
      // eslint-disable-next-line no-param-reassign
      fileInput.value = '';
    }
  }

  public getAcceptType(): string {
    if (this.deviceDetector.isMiAndroid()) {
      return 'image/*';
    }

    return this.allowedImgTypes
      .map((fileType) => `.${fileType}`)
      .join(',')
      .toLowerCase();
  }

  private subscribeToImg(): void {
    this.img$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap((imageObject) => {
          this.previousImageObjectUrl = imageObject?.imageObjectUrl;
          this.isModalOpened = true;
          return this.modalService.openModal<{ changeImage?: boolean; imageObjectUrl?: string }>(
            PhotoEditorModalComponent,
            imageObject,
          );
        }),
      )
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
  }

  private subscribeToImgAttachError(): void {
    this.imgAttachError$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap((imageErrors) =>
          this.modalService.openModal<{ changeImage?: boolean }>(PhotoErrorModalComponent, {
            imageErrors,
          }),
        ),
      )
      .subscribe((data) => {
        if (data?.changeImage) {
          this.fileInput.nativeElement.click();
        }
        this.changeDetectionRef.markForCheck();
      });
  }

  private subscribeToImageValidator(): void {
    merge(fromEvent(this.imageValidator, 'load'), fromEvent(this.imageValidator, 'error'))
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.validateImage();
        this.changeDetectionRef.markForCheck();
      });
  }

  private getRequestData(): ComponentUploadedFileDto {
    const { mnemonic = null, name = null, objectType = 2 } = this.uploadedFile;
    return {
      mnemonic,
      name,
      objectType,
      objectId: this.orderId.toString(),
      mimeType: 'image/jpeg',
    };
  }

  private setImageUrl(imageUrl: string): void {
    this.storedImageObjectUrl = imageUrl;
    this.croppedImageUrl = imageUrl;
    this.previousImageObjectUrl = imageUrl;
    this.croppedImageUrlEvent.emit(this.croppedImageUrl);
    this.changeDetectionRef.markForCheck();
  }

  private checkImagePresence(): void {
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

  private validateImage(): void {
    const { width, height, src } = this.imageValidator;

    const {
      isTypeValid,
      isSizeValid,
      isDPIValid,
      fileNameErrorMsg,
    } = this.validationService.validateImage(
      this.fileName,
      this.allowedImgTypes,
      width,
      height,
      this.validations,
    );

    if (isTypeValid && isSizeValid && isDPIValid && !fileNameErrorMsg) {
      this.img$.next({ imageObjectUrl: src });
      return;
    }

    const imageErrors = this.validationService.getImageError(
      isSizeValid,
      isTypeValid,
      isDPIValid,
      width,
      height,
      fileNameErrorMsg,
      this.allowedImgTypes,
    );

    if (this.storedImageObjectUrl) {
      this.img$.next({ imageObjectUrl: this.previousImageObjectUrl, imageErrors });
    } else {
      this.setImageUrl(this.storedImageObjectUrl);
      this.imgAttachError$.next(imageErrors);
    }
  }

  private blobToDataURL(file: Blob | File, callback: Function): void {
    const fileReader = new FileReader();
    fileReader.onload = (e): Function => callback(e.target.result.toString());
    fileReader.readAsDataURL(file);
  }

  private validateImageEvent(imageUrl: string): void {
    this.imageValidator.src = imageUrl;
  }

  private setFile(file: File, isPhoto: boolean): void {
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
  private fixFileName(fileName: string): string {
    if (this.deviceDetector.isMiAndroid()) {
      const extension = fileName.split('.').pop();
      return fileName.replace(`..${extension}`, `.${extension}`);
    }

    return fileName;
  }

  private changeCroppedPhoto(): void {
    this.img$.next({ imageObjectUrl: this.previousImageObjectUrl });
    this.startToChangeCroppedImageUrl.isStart = false;
  }

  private uploadPhotoToServer(): void {
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
