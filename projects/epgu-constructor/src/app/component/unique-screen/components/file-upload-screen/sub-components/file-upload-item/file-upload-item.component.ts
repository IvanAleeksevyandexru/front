import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import FilePonyfill from '@tanker/file-ponyfill';
import { BehaviorSubject, from, Observable, of, Subscription, throwError, Subject } from 'rxjs';
import {
  catchError,
  concatMap,
  filter,
  finalize,
  map,
  mergeMap,
  reduce,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { v4 } from 'uuid';
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
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../../services/terra-byte-api/terra-byte-api.types';
import {
  CompressionOptions,
  CompressionService,
} from '../../../upload-and-edit-photo/compression/compression.service';
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

enum FileItemStatus {
  error = 'error',
  uploading = 'uploading',
  uploaded = 'uploaded',
  preparation = 'preparation',
  downloading = 'downloading',
}

interface FileItem {
  raw?: File;
  id: string;
  item: UploadedFile;
  status: FileItemStatus;
  errors: FileItemError[];
}
interface FileItemError {
  type: string;
  text: string;
}

/*
 * FileUploadItem -
 * TerabyteListItem = UploadedFile = TerraUploadedFile
 * File
 *
 * */

const photoBaseName = 'Снимок';

const maxImgSizeInBytes = 525288;

@Component({
  selector: 'epgu-constructor-file-upload-item',
  templateUrl: './file-upload-item.component.html',
  styleUrls: ['./file-upload-item.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadItemComponent implements OnInit, OnDestroy {
  @Input() objectId: string;
  @Input() clarification: Clarifications;
  @Input() prefixForMnemonic: string;
  @Input() refData: string = null;
  @Input()
  set data(data: FileUploadItem) {
    this.loadData = data;
  }

  isMobile: boolean = this.deviceDetectorService.isMobile;
  uploadedCameraPhotoNumber = 0;
  listIsUploadingNow = false; // Флаг, что загружается список ранее прикреплённых файлов
  filesInUploading = 0; // Количество файлов, которое сейчас в состоянии загрузки на сервер
  filesInCompression = 0; // Количество файлов, проходящих через компрессию
  files$$ = new BehaviorSubject<TerraUploadedFile[]>([]); // Список уже загруженных файлов

  files$ = this.files$$
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

  listUploadingStatus = new BehaviorSubject<boolean>(false);

  processingFiles = new Subject<FileList>(); // Сюда попадают файлы на загрузку
  processingFiles$ = this.processingFiles.pipe(
    concatMap((files: FileList) => from(Array.from(files))), // разбиваем по файлу
    map(this.polyfillFile.bind(this)), // приводим файл к PonyFillFile
    map((file: File) => this.createFileItem({ raw: file, status: FileItemStatus.preparation })), // Формируем FileItem
    map((file: FileItem) => this.validateType(file)), // Проверка типа
    map((file: FileItem) => this.validateAmount(file)), // Проверка кол-ва
    concatMap((file: FileItem) => this.compressImage(file)), // Компрессия
    map((file: FileItem) => this.validateSize(file)), // Проверка размера
    tap((file: FileItem) => this.addFileItem(file)), // Добавление файла в общий поток
  );

  files = new BehaviorSubject<FileItem[]>([]);

  upploadingFiles$ = this.files.pipe(
    concatMap((files) => from(files)),
    filter((file: FileItem) => file.status === FileItemStatus.preparation),
    mergeMap(this.send.bind(this)),
  );
  downloadFiles = new BehaviorSubject<FileItem[]>([]);
  deleteFiles = new BehaviorSubject<FileItem[]>([]);

  files_$ = this.files.pipe(
    concatMap((files) => from(files)),
    reduce((acc, value) => {
      acc.push(value.item);
      return acc;
    }, []),
    // Выполнение операций относительно статусов
    map((files: UploadedFile[]) => this.sendUpdateEvent(files)),
  );
  subscriptions: Subscription = new Subscription()
    .add(this.processingFiles$.subscribe())
    .add(this.files_$.subscribe())
    .add(this.upploadingFiles$.subscribe());

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
  ) {}

  addDownload(file: FileItem): void {
    const files = this.downloadFiles.getValue();
    if (files.findIndex((item) => item.id === file.id) !== -1) {
      return;
    }
    files.push(file);
    this.downloadFiles.next(files);
  }

  // download(file: TerraUploadedFile) {
  //   const subs: Subscription = this.terabyteService
  //     .downloadFile(file.getParamsForFileOptions())
  //     .pipe(
  //       takeUntil(this.ngUnsubscribe$),
  //       catchError((e) => {
  //         this.handleError(ErrorActions.addDownloadErr, { name: file.fileName });
  //         return throwError(e);
  //       }),
  //     )
  //     .subscribe((result) => {
  //       this.terabyteService.pushFileToBrowserForDownload(result, file);
  //       subs.unsubscribe();
  //     });
  // }

  /**
   * Запрос на скачивание файла и отдачу пользователю
   * @param file - объект файла
   */
  // TODO избавиться от any в шаблоне
  downloadFile(file: FileItem): void {
    const files = this.downloadFiles.getValue();
    files.push(file);
    this.downloadFiles.next(files);
    // this.handleError(ErrorActions.clear);
    // const subs: Subscription = this.terabyteService
    //   .downloadFile(file.getParamsForFileOptions())
    //   .pipe(
    //     takeUntil(this.ngUnsubscribe$),
    //     catchError((e) => {
    //       this.handleError(ErrorActions.addDownloadErr, { name: file.fileName });
    //       return throwError(e);
    //     }),
    //   )
    //   .subscribe((result) => {
    //     this.terabyteService.pushFileToBrowserForDownload(result, file);
    //     subs.unsubscribe();
    //   });
  }

  createUploadOptions(file: FileItem): TerraUploadFileOptions {
    return {
      name: file.raw.name,
      mimeType: file.raw.type,
      objectId: this.objectId,
      objectType: UPLOAD_OBJECT_TYPE,
      mnemonic: this.getMnemonic(),
    } as TerraUploadFileOptions;
  }
  send(item: FileItem): Observable<void> {
    const options = this.createUploadOptions(item);

    return of(item).pipe(
      tap((file) => this.changeStatus(file, FileItemStatus.uploading)),
      tap((file) => this.fileUploadService.updateFilesSize(file.raw.size, this.loadData.uploadId)),
      concatMap((file) => this.terabyteService.uploadFile(options, file.raw)),
      catchError((e) => {
        this.updateFileItem(this.createError(ErrorActions.addUploadErr, item));
        this.fileUploadService.decrementFilesSize(item.raw.size, this.loadData.uploadId);
        return throwError(e);
      }),
      concatMap(() => this.terabyteService.getFileInfo(options)),
      map((upploaded) => {
        const uploadedItem = { ...item };
        uploadedItem.item = upploaded as UploadedFile;
        uploadedItem.status = FileItemStatus.uploaded;
        this.updateFileItem(uploadedItem);
      }),
      map(() => undefined),
    );
  }

  createFileItem(part: Partial<FileItem>): FileItem {
    const defaultItem = {
      id: v4(),
      raw: null,
      item: null,
      errors: [],
      status: FileItemStatus.preparation,
    } as FileItem;
    return { ...defaultItem, ...part } as FileItem;
  }

  createError(action: ErrorActions, file: FileItem): FileItem {
    const resultedFile = { ...file };
    const error = {
      type: action,
      text: this.getError(action, file.raw),
    } as FileItemError;
    resultedFile.errors.push(error);
    resultedFile.status = FileItemStatus.error;
    return resultedFile;
  }

  validateType(file: FileItem): FileItem {
    return this.isFileTypeValid(file.raw)
      ? file
      : this.createError(ErrorActions.addInvalidType, file);
  }

  validateAmount(file: FileItem): FileItem {
    let resultedFile = { ...file };
    const { isValid, reason } = this.fileUploadService.checkFilesAmount(1, this.loadData.uploadId);
    if (!isValid) {
      switch (reason) {
        case CheckFailedReasons.total: {
          resultedFile = this.createError(ErrorActions.addMaxTotalAmount, file);
          break;
        }
        case CheckFailedReasons.uploaderRestriction: {
          resultedFile = this.createError(ErrorActions.addMaxAmount, file);
          break;
        }
        default:
          break;
      }
    }
    return resultedFile;
  }

  compressImage(file: FileItem): Observable<FileItem> {
    const compressFileItem = { ...file };
    const compressedImageOptions: CompressionOptions = {
      maxSizeMB: getSizeInMB(maxImgSizeInBytes),
      deepChecking: true,
      maxWidthOrHeight: 1024,
    };
    return this.compressionService.isValidImageType(file.raw)
      ? from(this.compressionService.imageCompression(file.raw, compressedImageOptions)).pipe(
          catchError(() => {
            return of(this.createError(ErrorActions.addInvalidFile, file));
          }),
          map((raw: File) => {
            compressFileItem.raw = raw;
            return compressFileItem;
          }),
        )
      : of(compressFileItem);
  }

  validateSize(file: FileItem): FileItem {
    let resultedFile = { ...file };
    const { isValid, reason } = this.fileUploadService.checkFilesSize(
      file.raw.size,
      this.loadData.uploadId,
    );

    if (!isValid) {
      switch (reason) {
        case CheckFailedReasons.total: {
          resultedFile = this.createError(ErrorActions.addMaxTotalSize, resultedFile);
          break;
        }
        case CheckFailedReasons.uploaderRestriction: {
          resultedFile = this.createError(ErrorActions.addMaxSize, resultedFile);
          break;
        }
        default:
          break;
      }
    }
    return resultedFile;
  }

  sendUpdateEvent(files?: UploadedFile[], errors?: string[]): void {
    const resultValue: UploadedFile[] = files ?? this.files.getValue().map((file) => file.item);

    this.eventBusService.emit('fileUploadItemValueChangedEvent', {
      uploadId: this.loadData.uploadId,
      value: resultValue,
      errors: errors ?? this.errors,
    } as FileResponseToBackendUploadsItem);
  }

  updateSelectedFilesInfoAndSend(fileList: FileList): void {
    this.processingFiles.next(fileList);
  }

  getListStream(objectId: string): Observable<UploadedFile> {
    return of(objectId).pipe(
      tap(() => this.listUploadingStatus.next(true)),
      concatMap((id) => this.terabyteService.getListByObjectId(id) as Observable<UploadedFile[]>),
      catchError((e: HttpErrorResponse) => (e.status === 404 ? of([]) : throwError(e))),
      concatMap((files: UploadedFile[]) => from(files)),
      filter(
        (file) =>
          file?.mnemonic?.includes(this.getSubMnemonicPath()) && file?.objectId === this.objectId,
      ),
      finalize(() => this.listUploadingStatus.next(false)),
    );
  }

  addFileItem(file: FileItem): void {
    const files = this.files.getValue();
    files.push(file);
    this.files.next(files);
  }
  changeStatus(file: FileItem, status: FileItemStatus): void {
    const files = this.files.getValue();
    const index = files.findIndex((item) => item.id === file.id);
    files[index].status = status;
    this.files.next(files);
  }

  updateFileItem(file: FileItem): void {
    const files = this.files.getValue();
    const index = files.findIndex((item) => item.id === file.id);
    files[index] = file;
    this.files.next(files);
  }

  updateMaxFileNumber(file: UploadedFile): void {
    const index = Number(file.mnemonic.split('.').pop());
    this.maxFileNumber = index > this.maxFileNumber ? index : this.maxFileNumber;
  }

  loadList(): Observable<UploadedFile> {
    return this.getListStream(this.objectId).pipe(
      tap((file) =>
        this.addFileItem(this.createFileItem({ status: FileItemStatus.uploaded, item: file })),
      ),
      tap((file) => this.updateUploadingInfo(file)),
      tap((file) => this.updateMaxFileNumber(file)),
    );
  }

  ngOnInit(): void {
    this.maxFileNumber = -1;
    this.subscriptions.add(this.loadList().subscribe());
  }

  polyfillFile(file: File): File {
    const { type, lastModified, name } = file;

    return new FilePonyfill([file], name, {
      type,
      lastModified,
    });
  }

  // updateUploadedCameraPhotosInfo(addPhoto: boolean, fileName: string): void {
  //   if (!fileName?.includes(photoBaseName)) {
  //     return;
  //   }
  //   if (addPhoto) {
  //     this.uploadedCameraPhotoNumber += 1;
  //   }
  // }

  /**
   * Возращает промежуточный путь для формирования мнемомники, конретно для этой формы
   */
  getSubMnemonicPath(): string {
    return [this.prefixForMnemonic, this.data.uploadId].join('.');
  }

  /**
   * Возвращает мнемонику для файла, формируя уникальный префикс
   */
  getMnemonic(): string {
    this.maxFileNumber += 1;
    return [this.getSubMnemonicPath(), this.maxFileNumber].join('.');
  }

  getError(action: ErrorActions, file?: Partial<File>): string {
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

    return errorHandler[action];
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
  deleteFile(file: FileItem): void {
    const files = this.deleteFiles.getValue();
    files.push(file);
    this.deleteFiles.next(files);
    // this.handleError(ErrorActions.clear);
    //
    // if (file.uploaded) {
    //   this.filesInUploading += 1;
    //   this.terabyteService
    //     .deleteFile(file.getParamsForFileOptions())
    //     .pipe(
    //       takeUntil(this.ngUnsubscribe$),
    //       catchError((e) => {
    //         this.filesInUploading -= 1;
    //         this.handleError(ErrorActions.addDeletionErr, { name: file.fileName });
    //         return throwError(e);
    //       }),
    //     )
    //     .subscribe((deletedFileInfo: TerraUploadedFile) => {
    //       this.filesInUploading -= 1;
    //       this.updateUploadedCameraPhotosInfo(false, deletedFileInfo.fileName);
    //       this.updateUploadingInfo(deletedFileInfo, true);
    //       this.removeFileFromStore(file);
    //
    //       this.changeDetectionRef.markForCheck();
    //     });
    // } else {
    //   let files = this.files$$.value;
    //   files = files.filter((f) => f.mnemonic !== file.mnemonic);
    //   this.files$$.next(files);
    // }
  }

  updateUploadingInfo(fileInfo: TerraUploadedFile | UploadedFile, isDeleted?: boolean): void {
    if (isDeleted) {
      this.fileUploadService.updateFilesAmount(-1, this.loadData.uploadId);
      this.fileUploadService.updateFilesSize(-fileInfo.fileSize, this.loadData.uploadId);
    } else {
      this.fileUploadService.updateFilesAmount(1, this.loadData.uploadId);
      this.fileUploadService.updateFilesSize(fileInfo.fileSize, this.loadData.uploadId);
    }
  }

  isFileTypeValid(file: File): boolean {
    const fileExtension = `.${file.name.split('.').pop()}`;
    const validTypes = this.getAcceptTypes().split(',');

    return validTypes.some((validType) => validType.toLowerCase() === fileExtension.toLowerCase());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
