import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, from, merge, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, map, takeUntil, takeWhile, tap } from 'rxjs/operators';
import {
  FileResponseToBackendUploadsItem,
  FileUploadItem,
  Clarifications,
  TerabyteListItem,
} from '../../../../../../shared/services/terra-byte-api/terra-byte-api.types';
import { TerraByteApiService } from '../../../../../../shared/services/terra-byte-api/terra-byte-api.service';
import { getSizeInMB, TerraUploadedFile, UPLOAD_OBJECT_TYPE } from './data';
import { DeviceDetectorService } from '../../../../../../core/services/device-detector/device-detector.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { CompressionService } from '../../../upload-and-edit-photo/compression/compression.service';
import { ConfigService } from '../../../../../../core/config/config.service';
import { ModalService } from '../../../../../../modal/modal.service';
import { ConfirmationModalComponent } from '../../../../../../modal/confirmation-modal/confirmation-modal.component';

enum ErrorActions {
  clear = 'clear',
  addMaxSize = 'maxSize',
  addMaxAmount = 'maxAmount',
  addInvalidType = 'invalidType',
  addInvalidFile = 'invalidFile',
}

interface ModalParams {
  text: string;
  title: string;
  showCloseButton: boolean;
  showCrossButton: boolean;
  preview: boolean;
  buttons: Array<{ 
    label: string, 
    closeModal: boolean, 
    handler: () => any 
  }>
}

const photoBaseName = 'Снимок';

const maxImgSizeInBytes = 525288;

@Component({
  selector: 'epgu-constructor-file-upload-item',
  templateUrl: './file-upload-item.component.html',
  styleUrls: ['./file-upload-item.component.scss'],
  providers: [UnsubscribeService],
})
export class FileUploadItemComponent implements OnDestroy {
  private loadData: FileUploadItem;
  isMobile: boolean;
  uploadedFilesAmount = 0;
  uploadedFilesSize = 0;
  uploadedCameraPhotosAmount = 0;

  @Input() objectId: string;
  @Input() clarification: Clarifications;
  @Input()
  set data(data: FileUploadItem) {
    this.loadData = data;
    this.listIsUploadingNow = true;
    this.files$$.next([]);
    this.terabyteService
      .getListByObjectId(this.objectId)
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        catchError((e: any) => {
          this.listIsUploadingNow = false;
          return throwError(e);
        }),
        map((result) => this.filterServerListItemsForCurrentForm(result)),
        map((list: TerabyteListItem[]) => this.transformTerabyteItemsToUploadedFiles(list)),
      )
      .subscribe((list) => {
        this.listIsUploadingNow = false;
        if (list.length) {
          list.forEach((fileInfo: TerraUploadedFile) => {
            this.updateUploadingInfo(fileInfo);
          });
          // eslint-disable-next-line no-console
          this.files$$.next([...list]);
          this.maxFileNumber = this.getMaxFileNumberFromList(list);
        }
      });
  }
  get data() {
    return this.loadData;
  }
  @Input() prefixForMnemonic: string;
  @Input() refData: any = null;

  @Output() newValueSet: EventEmitter<FileResponseToBackendUploadsItem> = new EventEmitter<
    FileResponseToBackendUploadsItem
  >();

  @ViewChild('fileUploadInput', {
    static: true,
  })
  uploadInput: ElementRef;

  @ViewChild('cameraInput', {
    static: true,
  })
  cameraInput: ElementRef;
  get isButtonsDisabled() {
    return this.listIsUploadingNow || this.filesInUploading > 0;
  }

  private subs: Subscription[] = [];
  private maxFileNumber = -1;

  private compressTypes = ['image/jpeg', 'image/png'];
  isCameraAllowed = false; // Флаг, что камеры нет или она запрещена
  listIsUploadingNow = false; // Флаг, что загружается список ранее прикреплённых файлов
  filesInUploading = 0; // Количество файлов, которое сейчас в состоянии загрузки на сервер
  files$$ = new BehaviorSubject<TerraUploadedFile[]>([]); // Список уже загруженных файлов
  files$ = this.files$$
    .asObservable()
    .pipe(
      takeUntil(this.ngUnsubscribe$),
      tap((files) => {
        if (this.loadData) {
          this.newValueSet.emit({
            uploadId: this.loadData.uploadId,
            value: files,
            errors: this.errors,
          } as FileResponseToBackendUploadsItem);
        }
      }),
    )
    .subscribe();
  errors: string[] = [];

  constructor(
    private terabyteService: TerraByteApiService,
    private deviceDetectorService: DeviceDetectorService,
    private compressionService: CompressionService,
    private ngUnsubscribe$: UnsubscribeService,
    public config: ConfigService,
    public modal: ModalService,
  ) {
    this.isMobile = deviceDetectorService.isMobile;
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
  });
  }

  private openPreviewModal(modalParams: ModalParams): void {
    this.modal.openModal(ConfirmationModalComponent,
      modalParams,
    );
  }

  /**
   * Переводит список файлов с сервера в файлы для отображения
   * @param list - массив информациио файлах на сервере
   * @private
   */
  private transformTerabyteItemsToUploadedFiles(
    list: TerabyteListItem[] = [],
  ): TerraUploadedFile[] {
    let filesList: TerraUploadedFile[] = [];
    if (list.length) {
      filesList = list.map((terraFile: TerabyteListItem) => {
        const file = new TerraUploadedFile(terraFile);
        file.uploaded = true;
        return file;
      });
    }
    return filesList;
  }

  /**
   * Фильтрует список файлов полученных с сервера, чтобы были только для этой формы
   * @param result - список файлов, хранящихся на сервере
   * @private
   */
  private filterServerListItemsForCurrentForm(result: TerabyteListItem[]): TerabyteListItem[] {
    return result.filter(
      (fileInfo) =>
        fileInfo?.mnemonic?.includes(this.getSubMnemonicPath()) &&
        fileInfo?.objectId === this.objectId,
    );
  }

  /**
   * Возращает промежуточный путь для формирования мнемомники, конретно для этой формы
   * @private
   */
  private getSubMnemonicPath(): string {
    return [this.prefixForMnemonic, this.data.uploadId].join('.');
  }

  /**
   * Возвращает мнемонику для файла, формируя уникальный префикс
   * @private
   */
  private getMnemonic(): string {
    this.maxFileNumber += 1;
    return [this.getSubMnemonicPath(), this.maxFileNumber].join('.');
  }

  /**
   * Устанавливает сведения Фаой
   * @param uploadedFile - файл загружаемый на сервер
   * @param fileSize - размер фай
   * @param uploaded - файл загружен?
   * @private
   */
  private setFileInfoUploaded(
    uploadedFile: TerraUploadedFile,
    fileSize: number,
    uploaded: boolean,
  ) {
    const files = this.files$$.value;
    files.forEach((f: TerraUploadedFile) => {
      if (f.mnemonic === uploadedFile.mnemonic) {
        // eslint-disable-next-line no-param-reassign
        f.uploaded = uploaded;
        // eslint-disable-next-line no-param-reassign
        f.hasError = !uploaded;
        // eslint-disable-next-line no-param-reassign
        f.fileSize = fileSize;
      }
    });
    this.files$$.next(files);
  }

  /**
   * Подгружает информацию с сервера
   *
   * @param uploadedFile - файл предварительно загруженный на сервер
   * @param uploaded - признак что файл загружен
   * @private
   */
  private updateFileInfoFromServer(uploadedFile: TerraUploadedFile, uploaded: boolean = true) {
    this.filesInUploading -= 1;

    if (uploaded) {
      this.updateUploadingInfo(uploadedFile);

      this.terabyteService
        .getFileInfo(uploadedFile.getParamsForFileOptions())
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((result: TerabyteListItem) => {
          this.setFileInfoUploaded(uploadedFile, result.fileSize, uploaded);
        });
    } else {
      this.setFileInfoUploaded(uploadedFile, 0, uploaded);
    }
  }

  updateUploadedCameraPhotosInfo(addPhoto: boolean, fileName: string) {
    if (!fileName?.includes(photoBaseName)) {
      return;
    }
    if (addPhoto) {
      this.uploadedCameraPhotosAmount += 1;
    } else {
      this.uploadedCameraPhotosAmount -= 1;
    }
  }

  /**
   * Отправляет файл на сервер
   * @param file - file object to upload
   * @private
   */
  private async sendFile(file: File) {
    console.log(file);
    this.filesInUploading += 1;

    const files = this.files$$.value;

    const fileToUpload = new TerraUploadedFile({
      fileName: file.name,
      objectId: this.objectId,
      objectTypeId: UPLOAD_OBJECT_TYPE,
      mnemonic: this.getMnemonic(),
    });

    files.push(fileToUpload);
    this.subs.push(
      this.terabyteService
        .uploadFile(fileToUpload.getParamsForUploadFileOptions(), file)
        .pipe(
          takeUntil(this.ngUnsubscribe$),
          catchError((e: any) => {
            this.updateFileInfoFromServer(fileToUpload, false);
            return throwError(e);
          }),
        )
        .subscribe(() => {
          this.updateUploadedCameraPhotosInfo(true, file.name);
          this.updateFileInfoFromServer(fileToUpload);
        }),
    );
  }

  /**
   * Подготавливает файлы на загрузку и возращает итоговый проверенный
   * список для загрузки и добавления в общий список загружаемых файлов
   * @param filesToUpload
   * @param isPhoto
   * @private
   */
  private prepareFilesToUpload(filesToUpload: FileList, isPhoto?: boolean): Observable<File | any > {
    this.handleError(ErrorActions.clear);
    const files = isPhoto
      ? this.handleAndFormatPhotoFiles(filesToUpload)
      : this.filterValidFiles(filesToUpload);
    const filesLength = files.length + this.uploadedFilesAmount;

    if (filesLength > this.data.maxFileCount) {
      this.handleError(ErrorActions.addMaxAmount);
      return of();
    }

    const compressedFiles = this.compressImages(files);

    return merge(...compressedFiles).pipe(
      takeWhile((file: File) => this.validateAndHandleFilesSize(file)),
    );
  }

  handleAndFormatPhotoFiles(filesToUpload: FileList): File[] {
    return Array.from(filesToUpload).map((photo: File) => {
      const photoType = photo.name.split('.').pop() || 'jpg';
      const photoFullName = `${photoBaseName}_${this.uploadedCameraPhotosAmount + 1}.${photoType}`;

      return new File([photo], `${photoFullName}`, { ...photo });
    });
  }

  compressImages(files: File[]): Array<Observable<any>> {
    const compressedImageOptions = {
      maxSizeMB: getSizeInMB(maxImgSizeInBytes),
      deepChecking: true,
    };

    return files.map((file: File) => {
      if (this.compressTypes.includes(file.type)) {
        return from(this.compressionService.imageCompression(file, compressedImageOptions)).pipe(
          catchError(() => {
            this.handleError(ErrorActions.addInvalidFile, file);
            return of();
          }),
        );
      }
      return of(file);
    });
  }

  validateAndHandleFilesSize(file: File): boolean {
    const newSize = this.uploadedFilesSize + file.size;
    const isSizeValid = newSize < this.data.maxSize;

    if (isSizeValid) {
      this.uploadedFilesSize = newSize;
    } else {
      this.handleError(ErrorActions.addMaxSize);
    }
    return isSizeValid;
  }

  filterValidFiles(files: FileList): File[] {
    return Array.from(files).reduce((acc: File[], file: File) => {
      if (this.isFileTypeValid(file)) {
        acc.push(file);
      } else {
        this.handleError(ErrorActions.addInvalidType, file);
      }
      return acc;
    }, []);
  }

  handleError(action: ErrorActions, file?: File): void {
    const errorHandler = {};
    // eslint-disable-next-line prettier/prettier
    errorHandler[ErrorActions.addMaxAmount] = `Максимальное число файлов на загрузку - ${this.data.maxFileCount}`;
    // eslint-disable-next-line prettier/prettier
    errorHandler[ErrorActions.addMaxSize] = `Размер файлов превышает ${getSizeInMB(this.data.maxSize)} МБ`;
    // eslint-disable-next-line prettier/prettier
    errorHandler[ErrorActions.addInvalidType] = `Недопустимый тип файла "${file?.name}"`;
    // eslint-disable-next-line prettier/prettier
    errorHandler[ErrorActions.addInvalidFile] = `Ошибка загрузки файла "${file?.name}"`;

    if (action === ErrorActions.clear) {
      this.errors = [];
    } else {
      this.errors.push(errorHandler[action]);
      this.newValueSet.emit({ errors: this.errors });
    }
  }

  /**
   * Возвращает максимальный индекс файла загрузки из списка уже загруженных
   * @param list - список файлов загруженных с сервера
   * @private
   */
  private getMaxFileNumberFromList(list: TerraUploadedFile[]): number {
    const maxIndex = -1;
    return list.reduce((item, file) => {
      const index = Number(file.mnemonic.split('.').pop());
      return index > maxIndex ? index : item;
    }, -1);
  }

  /**
   * Возращает типы файлов, которые должны принимать
   */
  getAcceptTypes(): string {
    if (!this.data.fileType.length) {
      return null;
    }
    return this.data.fileType
      .map((fileType) => `.${fileType}`)
      .join(',')
      .toLowerCase();
  }

  /**
   * Удаление файла из стека
   * @param file - объект файла на удаление
   */
  deleteFile(file: TerraUploadedFile) {
    this.errors = [];

    if (file.uploaded) {
      this.filesInUploading += 1;
      this.terabyteService
        .deleteFile(file.getParamsForFileOptions())
        .pipe(
          takeUntil(this.ngUnsubscribe$),
          catchError((e: any) => {
            this.filesInUploading -= 1;
            return throwError(e);
          }),
        )
        .subscribe((deletedFileInfo: TerraUploadedFile) => {
          this.filesInUploading -= 1;
          this.updateUploadedCameraPhotosInfo(false, deletedFileInfo.fileName);
          this.updateUploadingInfo(deletedFileInfo, true);

          let files = this.files$$.value;
          files = files.filter((f) => f.mnemonic !== file.mnemonic);
          this.files$$.next(files);
        });
    } else {
      let files = this.files$$.value;
      files = files.filter((f) => f.mnemonic !== file.mnemonic);
      this.files$$.next(files);
    }
    this.uploadInput.nativeElement.value = '';
  }

  updateUploadingInfo(fileInfo: TerraUploadedFile, isDeleted?: boolean) {
    if (isDeleted) {
      this.uploadedFilesAmount -= 1;
      this.uploadedFilesSize =
        this.uploadedFilesSize < fileInfo.fileSize ? 0 : this.uploadedFilesSize - fileInfo.fileSize;
    } else {
      this.uploadedFilesAmount += 1;
      this.uploadedFilesSize += fileInfo.fileSize;
    }
  }

  /**
   * Обновляет данные о файлах, которые были загружены
   */
   updateSelectedFilesInfoAndSend(fileList: FileList, isPhoto?: boolean) {
    this.prepareFilesToUpload(fileList, isPhoto).subscribe(
      async (file: File) => {
        if (isPhoto) {
          const src = await this.fileToBase64(file);

          this.openPreviewModal({
            text: `<div style="padding:0;">
                    <img src="${src}" alt="${file.name}" />
                  </div>`,
            title: 'Просмотр фото',
            showCloseButton: false,
            showCrossButton: true,
            preview: true,
            buttons: [{
              label: 'Использовать',
              closeModal: true,
              handler: () => this.sendFile(file),
            }]
          });
        } else {
          this.sendFile(file)
        }
      }
    );
  }

  isFileTypeValid(file: File): boolean {
    const fileExtension = `.${file.name.split('.').pop()}`;
    const validTypes = this.getAcceptTypes().split(',');

    return validTypes.some((validType) => validType.toLowerCase() === fileExtension.toLowerCase());
  }

  /**
   * Загрузка файлов на сервер террабайта через стандартный выбор
   */
  selectFilesEvent() {
    this.uploadInput.nativeElement.click();
  }

  /**
   * Открытие камеры для получения изображения и последующей загрузки
   */
  openCamera() {
    this.cameraInput.nativeElement.click();
  }

  /**
   * Запрос на скачивание файла и отдачу пользователю
   * @param file - объект файла
   */
  downloadFile(file: TerraUploadedFile) {
    this.errors = [];
    const subs: Subscription = this.terabyteService
      .downloadFile(file.getParamsForFileOptions())
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        catchError((e: any) => {
          this.errors.push(`Не удалось скачать файл ${file.fileName}`);
          return throwError(e);
        }),
      )
      .subscribe((result) => {
        this.terabyteService.pushFileToBrowserForDownload(result, file);
        subs.unsubscribe();
      });
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
