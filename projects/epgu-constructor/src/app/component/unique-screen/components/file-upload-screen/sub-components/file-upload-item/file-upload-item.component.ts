import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import FilePonyfill from '@tanker/file-ponyfill';
import { BehaviorSubject, from, merge, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, map, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { DeviceDetectorService } from '../../../../../../core/services/device-detector/device-detector.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { ModalService } from '../../../../../../modal/modal.service';
import { TerraByteApiService } from '../../../../services/terra-byte-api/terra-byte-api.service';
import {
  Clarifications,
  FileResponseToBackendUploadsItem,
  FileUploadItem,
  TerabyteListItem,
} from '../../../../services/terra-byte-api/terra-byte-api.types';
import {
  CompressionOptions,
  CompressionService,
} from '../../../upload-and-edit-photo/service/compression/compression.service';
import { CheckFailedReasons, FileUploadService } from '../file-upload.service';
import { getSizeInMB, TerraUploadedFile, UPLOAD_OBJECT_TYPE } from './data';

enum ErrorActions {
  clear = 'clear',
  addMaxSize = 'maxSize',
  addMaxAmount = 'maxAmount',
  addMaxTotalAmount = 'maxTotalAmount',
  addMaxTotalSize = 'maxTotalSize',
  addInvalidType = 'invalidType',
  addInvalidFile = 'invalidFile',
  addDownloadErr = 'addDownloadErr',
  addUploadErr = 'addUploadErr',
  addDeletionErr = 'addDeletionErr',
}

const photoBaseName = 'Снимок';

const maxImgSizeInBytes = 525288;

@Component({
  selector: 'epgu-constructor-file-upload-item',
  templateUrl: './file-upload-item.component.html',
  styleUrls: ['./file-upload-item.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadItemComponent implements OnDestroy {
  @Input() objectId: string;
  @Input() clarification: Clarifications;
  @Input() prefixForMnemonic: string;
  @Input() refData: string = null;
  @Input()
  set data(data: FileUploadItem) {
    this.loadData = data;
    this.listIsUploadingNow = true;
    this.files$$.next([]);
    this.terabyteService
      .getListByObjectId(this.objectId)
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        catchError((e: HttpErrorResponse) => {
          if (e.status === 404) {
            return of([]);
          }
          this.listIsUploadingNow = false;
          this.changeDetectionRef.markForCheck();
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

        this.changeDetectionRef.markForCheck();
      });
  }

  @ViewChild('fileUploadInput', { static: true })
  uploadInput: ElementRef;

  @ViewChild('cameraInput', { static: true })
  cameraInput: ElementRef;

  isMobile: boolean;
  uploadedCameraPhotoNumber = 0;
  listIsUploadingNow = false; // Флаг, что загружается список ранее прикреплённых файлов
  filesInUploading = 0; // Количество файлов, которое сейчас в состоянии загрузки на сервер
  filesInCompression = 0; // Количество файлов, проходящих через компрессию
  files$$ = new BehaviorSubject<TerraUploadedFile[]>([]); // Список уже загруженных файлов

  files$ = this.files$$
    .asObservable()
    .pipe(
      takeUntil(this.ngUnsubscribe$),
      tap((files) => {
        if (this.loadData) {
          this.eventBusService.emit('fileUploadItemValueChangedEvent', {
            uploadId: this.loadData.uploadId,
            value: files,
            errors: this.errors,
          } as FileResponseToBackendUploadsItem);
        }
      }),
    )
    .subscribe();
  errors: string[] = [];

  get data(): FileUploadItem {
    return this.loadData;
  }

  get isButtonsDisabled(): boolean {
    return Boolean(this.listIsUploadingNow || this.filesInUploading || this.filesInCompression);
  }

  private loadData: FileUploadItem;
  private subs: Subscription[] = [];
  private maxFileNumber = -1;

  constructor(
    private terabyteService: TerraByteApiService,
    private deviceDetectorService: DeviceDetectorService,
    private compressionService: CompressionService,
    private ngUnsubscribe$: UnsubscribeService,
    private fileUploadService: FileUploadService,
    public config: ConfigService,
    public modal: ModalService,
    private eventBusService: EventBusService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {
    this.isMobile = this.deviceDetectorService.isMobile;
  }
  updateUploadedCameraPhotosInfo(addPhoto: boolean, fileName: string): void {
    if (!fileName?.includes(photoBaseName)) {
      return;
    }
    if (addPhoto) {
      this.uploadedCameraPhotoNumber += 1;
    }
  }

  createCustomFile(file: File, fileName: string): File {
    const { type, lastModified } = file;

    return new FilePonyfill([file], fileName, {
      type,
      lastModified,
    });
  }

  compressImages(files: File[]): Array<Observable<unknown>> {
    this.filesInCompression += files.length;

    const compressedImageOptions: CompressionOptions = {
      maxSizeMB: getSizeInMB(maxImgSizeInBytes),
      deepChecking: true,
      maxWidthOrHeight: 1024,
    };

    return files.map((file: File) => {
      const terabyteFiles = this.files$$.value;
      let fileToAction = this.createCustomFile(file, file.name);
      const fileName = file.name;

      const fileToUpload = new TerraUploadedFile({
        fileName,
        objectId: this.objectId,
        objectTypeId: UPLOAD_OBJECT_TYPE,
        mnemonic: this.getMnemonic(),
      });

      this.files$$.next([fileToUpload, ...terabyteFiles]);
      if (this.compressionService.isValidImageType(fileToAction)) {
        fileToAction = this.createCustomFile(fileToAction, fileName);

        return from(
          this.compressionService.imageCompression(fileToAction, compressedImageOptions),
        ).pipe(
          catchError(() => {
            this.handleError(ErrorActions.addInvalidFile, fileToAction);
            this.filesInCompression -= 1;
            this.removeFileFromStore(fileToUpload);
            return of();
          }),
        );
      }

      fileToAction = this.createCustomFile(fileToAction, fileName);

      return of(fileToAction);
    });
  }

  validateAndHandleFilesSize(file: File): boolean {
    const {
      isValid: isSizeValid,
      reason: failedSizeReason,
    } = this.fileUploadService.checkFilesSize(file.size, this.loadData.uploadId);

    if (isSizeValid) {
      this.fileUploadService.updateFilesSize(file.size, this.loadData.uploadId);
      this.filesInCompression -= 1;
    } else {
      if (failedSizeReason === CheckFailedReasons.total) {
        this.handleError(ErrorActions.addMaxTotalSize);
      }
      if (failedSizeReason === CheckFailedReasons.uploaderRestriction) {
        this.handleError(ErrorActions.addMaxSize);
      }
      this.filesInCompression = 0;
      this.removeFileFromStore(file);
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

  handleError(action: ErrorActions, file?: Partial<File>): void {
    const errorHandler = {};
    errorHandler[
      ErrorActions.addMaxTotalAmount
    ] = `Максимальное количество всех файлов - ${this.fileUploadService.getMaxTotalFilesAmount()}`;

    errorHandler[ErrorActions.addMaxTotalSize] = `Размер всех файлов превышает ${getSizeInMB(
      this.fileUploadService.getMaxTotalFilesSize(),
    )} МБ`;

    // eslint-disable-next-line prettier/prettier
    errorHandler[
      ErrorActions.addMaxAmount
    ] = `Максимальное количество файлов для документа - ${this.data.maxFileCount}`;
    // eslint-disable-next-line prettier/prettier
    errorHandler[ErrorActions.addMaxSize] = `Размер файлов для документа превышает ${getSizeInMB(
      this.data.maxSize,
    )} МБ`;
    errorHandler[ErrorActions.addInvalidType] = `Недопустимый тип файла "${file?.name}"`;
    errorHandler[ErrorActions.addInvalidFile] = `Ошибка загрузки файла "${file?.name}"`;
    errorHandler[ErrorActions.addDownloadErr] = `Не удалось скачать файл "${file?.name}"`;
    errorHandler[ErrorActions.addUploadErr] = `Ошибка загрузки файла "${file?.name}" на сервер`;
    errorHandler[ErrorActions.addDeletionErr] = `Не удалось удалить файл "${file?.name}"`;

    if (action === ErrorActions.clear) {
      this.errors = [];
    } else {
      this.errors.push(errorHandler[action]);
      this.eventBusService.emit('fileUploadItemValueChangedEvent', {
        errors: this.errors,
      } as FileResponseToBackendUploadsItem);
    }
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

  removeFileFromStore(file: TerraUploadedFile | File): void {
    let files = this.files$$.value;
    if (file instanceof File) {
      files = files.filter((terabyteFile) => terabyteFile.fileName !== file.name);
    } else {
      files = files.filter((f) => f.mnemonic !== file.mnemonic);
    }
    this.files$$.next(files);
  }

  /**
   * Удаление файла из стека
   * @param file - объект файла на удаление
   */
  deleteFile(file: TerraUploadedFile): void {
    this.handleError(ErrorActions.clear);

    if (file.uploaded) {
      this.filesInUploading += 1;
      this.terabyteService
        .deleteFile(file.getParamsForFileOptions())
        .pipe(
          takeUntil(this.ngUnsubscribe$),
          catchError((e) => {
            this.filesInUploading -= 1;
            this.handleError(ErrorActions.addDeletionErr, { name: file.fileName });
            return throwError(e);
          }),
        )
        .subscribe((deletedFileInfo: TerraUploadedFile) => {
          this.filesInUploading -= 1;
          this.updateUploadedCameraPhotosInfo(false, deletedFileInfo.fileName);
          this.updateUploadingInfo(deletedFileInfo, true);
          this.removeFileFromStore(file);

          this.changeDetectionRef.markForCheck();
        });
    } else {
      let files = this.files$$.value;
      files = files.filter((f) => f.mnemonic !== file.mnemonic);
      this.files$$.next(files);
    }
    this.uploadInput.nativeElement.value = '';
  }

  updateUploadingInfo(fileInfo: TerraUploadedFile, isDeleted?: boolean): void {
    if (isDeleted) {
      this.fileUploadService.updateFilesAmount(-1, this.loadData.uploadId);
      this.fileUploadService.updateFilesSize(-fileInfo.fileSize, this.loadData.uploadId);
    } else {
      this.fileUploadService.updateFilesAmount(1, this.loadData.uploadId);
      this.fileUploadService.updateFilesSize(fileInfo.fileSize, this.loadData.uploadId);
    }
  }

  resetFileInputState(htmlInput: HTMLInputElement): void {
    // eslint-disable-next-line no-param-reassign
    htmlInput.value = null;
  }

  /**
   * Обновляет данные о файлах, которые были загружены
   */
  updateSelectedFilesInfoAndSend(fileList: FileList, isPhoto?: boolean): void {
    this.prepareFilesToUpload(fileList, isPhoto).subscribe((file: File) => this.sendFile(file));
  }

  isFileTypeValid(file: File): boolean {
    const fileExtension = `.${file.name.split('.').pop()}`;
    const validTypes = this.getAcceptTypes().split(',');

    return validTypes.some((validType) => validType.toLowerCase() === fileExtension.toLowerCase());
  }

  /**
   * Загрузка файлов на сервер террабайта через стандартный выбор
   */
  selectFilesEvent(): void {
    this.uploadInput.nativeElement.click();
  }

  /**
   * Открытие камеры для получения изображения и последующей загрузки
   */
  openCamera(): void {
    this.cameraInput.nativeElement.click();
  }

  /**
   * Запрос на скачивание файла и отдачу пользователю
   * @param file - объект файла
   */
  // TODO избавиться от any в шаблоне
  downloadFile(file: TerraUploadedFile): void {
    this.handleError(ErrorActions.clear);
    const subs: Subscription = this.terabyteService
      .downloadFile(file.getParamsForFileOptions())
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        catchError((e) => {
          this.handleError(ErrorActions.addDownloadErr, { name: file.fileName });
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
   * Устанавливает сведения Файла
   * @param uploadedFile - файл загружаемый на сервер
   * @param fileSize - размер фай
   * @param uploaded - файл загружен?
   * @private
   */
  private setFileInfoUploaded(
    uploadedFile: TerraUploadedFile,
    terraFile: TerabyteListItem,
    uploaded: boolean,
  ): void {
    const files = this.files$$.value;
    files.forEach((f: TerraUploadedFile) => {
      if (f.mnemonic === uploadedFile.mnemonic) {
        f.setParamsForUploadedFile(terraFile, uploaded);
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
  private updateFileInfoFromServer(
    uploadedFile: TerraUploadedFile,
    uploaded: boolean = true,
  ): void {
    this.filesInUploading -= 1;

    if (uploaded) {
      this.updateUploadingInfo(uploadedFile);

      this.terabyteService
        .getFileInfo(uploadedFile.getParamsForFileOptions())
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((terraFile: TerabyteListItem) =>
          this.setFileInfoUploaded(uploadedFile, terraFile, uploaded),
        );
    } else {
      this.removeFileFromStore(uploadedFile);
    }
  }

  /**
   * Отправляет файл на сервер
   * @param file - file object to upload
   * @private
   */
  private sendFile(file: File): void {
    this.filesInUploading += 1;

    const terabyteFiles = this.files$$.value;
    const fileToUpload = terabyteFiles.filter(
      (terabyteFile) => terabyteFile.fileName === file.name,
    )[0];
    this.listIsUploadingNow = false;
    fileToUpload.mimeType = file.type;

    this.subs.push(
      this.terabyteService
        .uploadFile(fileToUpload.getParamsForUploadFileOptions(), file)
        .pipe(
          takeUntil(this.ngUnsubscribe$),
          catchError((e) => {
            this.handleError(ErrorActions.addUploadErr, file);
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
  private prepareFilesToUpload(filesToUpload: FileList, isPhoto?: boolean): Observable<File> {
    this.handleError(ErrorActions.clear);
    const files = isPhoto ? Array.from(filesToUpload) : this.filterValidFiles(filesToUpload);

    const {
      isValid: isAmountValid,
      reason: amountFailedReason,
    } = this.fileUploadService.checkFilesAmount(files.length, this.loadData.uploadId);

    if (!isAmountValid) {
      if (amountFailedReason === CheckFailedReasons.total) {
        this.handleError(ErrorActions.addMaxTotalAmount);
      } else if (amountFailedReason === CheckFailedReasons.uploaderRestriction) {
        this.handleError(ErrorActions.addMaxAmount);
      }
      return of();
    }

    const compressedFiles = this.compressImages(files);

    return merge(...compressedFiles).pipe(
      takeWhile((file: File) => this.validateAndHandleFilesSize(file)),
    );
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
}
