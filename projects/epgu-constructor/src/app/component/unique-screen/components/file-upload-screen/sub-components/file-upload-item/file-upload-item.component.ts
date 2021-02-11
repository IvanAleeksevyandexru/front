import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import FilePonyfill from '@tanker/file-ponyfill';
import { BehaviorSubject, from, Observable, of, Subject, Subscription, throwError } from 'rxjs';
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
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { DeviceDetectorService } from '../../../../../../core/services/device-detector/device-detector.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { ModalService } from '../../../../../../modal/modal.service';
import { TerraByteApiService } from '../../../../services/terra-byte-api/terra-byte-api.service';
import {
  Clarifications,
  FileResponseToBackendUploadsItem,
  FileUploadItem,
  UploadedFile,
} from '../../../../services/terra-byte-api/terra-byte-api.types';
import { FileUploadService } from '../file-upload.service';
import {
  ErrorActions,
  FileItem,
  FileItemError,
  FileItemStatus,
  FileItemStore,
  getSizeInMB,
  Operation,
  OperationType,
  UPLOAD_OBJECT_TYPE,
} from './data';
import { PrepareService } from '../prepare.service';

@Component({
  selector: 'epgu-constructor-file-upload-item',
  templateUrl: './file-upload-item.component.html',
  styleUrls: ['./file-upload-item.component.scss'],
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
    this.updateAcceptTypes();
  }
  acceptTypes?: string;

  isMobile: boolean = this.deviceDetectorService.isMobile;
  fileStatus = FileItemStatus;
  errors: string[] = [];

  listUploadingStatus = new BehaviorSubject<boolean>(false);

  processingFiles = new Subject<FileList>(); // Сюда попадают файлы на загрузку
  processingFiles$ = this.processingFiles.pipe(
    concatMap((files: FileList) => from(Array.from(files))), // разбиваем по файлу
    map(this.polyfillFile.bind(this)), // приводим файл к PonyFillFile
    map((file: File) => new FileItem(FileItemStatus.preparation, file)), // Формируем FileItem
    tap((file: FileItem) => this.store.add(file)), // Добавление файла в общий поток
    tap((file: FileItem) => this.updateUploadingInfo(file)),
    tap((file: FileItem) => this.addPrepare(file)),
  );

  store = new FileItemStore();

  files = this.store.files;
  files$ = this.files.pipe(
    concatMap((files) =>
      from(files).pipe(
        reduce<FileItem, FileResponseToBackendUploadsItem>(this.reduceChanges.bind(this), {
          value: [],
          errors: [],
        }),
      ),
    ),
    tap((result: FileResponseToBackendUploadsItem) => this.sendUpdateEvent(result)), // Отправка изменений
  );

  get data(): FileUploadItem {
    return this.loadData;
  }

  get isButtonsDisabled(): boolean {
    return false;
  }

  operationsUploading: Record<string, Operation> = {};
  operationsDownloading: Record<string, Operation> = {};
  operationsDelition: Record<string, Operation> = {};
  operationsPreparing: Record<string, Operation> = {};

  processingOperations = new Subject<Operation>();
  processingOperations$ = this.processingOperations.pipe(
    mergeMap((operation: Operation) => {
      const { status: fileStatus } = operation.item;

      let storage: Record<string, Operation>;
      let executor: Observable<void>;
      switch (operation.type) {
        case OperationType.delete: {
          storage = this.operationsDelition;
          executor = this.delition(operation);
          break;
        }
        case OperationType.download: {
          storage = this.operationsDownloading;
          executor = this.downloading(operation);
          break;
        }
        case OperationType.upload: {
          storage = this.operationsUploading;
          executor = this.uploading(operation);
          break;
        }
        case OperationType.prepare: {
          storage = this.operationsPreparing;
          executor = this.preparing(operation);
          break;
        }
        default: {
          break;
        }
      }
      if (storage[operation.item.id]) {
        return of(undefined);
      }
      storage[operation.item.id] = operation;
      return executor.pipe(
        takeUntil(
          storage[operation.item.id].cancel.pipe(
            filter((status) => status === true),
            tap(() => this.store.changeStatus(operation.item, fileStatus)),
            tap(() =>
              operation.type === OperationType.upload || operation.type === OperationType.prepare
                ? this.store.remove(operation.item)
                : null,
            ),
          ),
        ),
        catchError(() => of(undefined)),
        finalize(() => {
          delete storage[operation.item.id];
        }),
      );
    }),
  );

  subscriptions: Subscription = new Subscription()
    .add(this.processingFiles$.subscribe())
    .add(this.processingOperations$.subscribe());

  private loadData: FileUploadItem;
  private maxFileNumber = -1;

  constructor(
    private terabyteService: TerraByteApiService,
    private deviceDetectorService: DeviceDetectorService,
    private fileUploadService: FileUploadService,
    public config: ConfigService,
    public modal: ModalService,
    private eventBusService: EventBusService,
    private prepareService: PrepareService,
  ) {}

  reduceChanges(
    acc: FileResponseToBackendUploadsItem,
    value: FileItem,
  ): FileResponseToBackendUploadsItem {
    if (value.item) {
      acc.value.push(value.item);
    }
    if (value.error) {
      acc.errors.push(value.error.text);
    }
    return acc;
  }

  update(fileItem: FileItem): void {
    this.addPrepare(fileItem);
  }

  cancelOperation(type: OperationType, item: FileItem): void {
    let storage: Record<string, Operation>;
    switch (type) {
      case OperationType.delete: {
        storage = this.operationsDelition;
        break;
      }
      case OperationType.download: {
        storage = this.operationsDownloading;
        break;
      }
      case OperationType.upload: {
        storage = this.operationsUploading;
        break;
      }
      case OperationType.prepare: {
        storage = this.operationsPreparing;
        break;
      }
      default: {
        break;
      }
    }
    storage[item.id]?.cancel.next(true);
  }
  createOperation(type: OperationType, item: FileItem): void {
    const operation = {
      type,
      item,
      cancel: new BehaviorSubject<boolean>(false),
    } as Operation;
    this.processingOperations.next(operation);
  }

  repeat(file: FileItem): void {
    const files = this.store.files.getValue();
    files.forEach((item) =>
      item?.error?.type === file?.error?.type ? this.addPrepare(item) : null,
    );
  }
  addPrepare(file: FileItem): void {
    this.createOperation(OperationType.prepare, file);
  }

  preparing(operation: Operation): Observable<void> {
    const fileItem = operation.item;
    return of(fileItem).pipe(
      tap((file: FileItem) => this.store.changeStatus(file, FileItemStatus.preparation)),
      concatMap((file: FileItem) =>
        this.prepareService.prepare(file, this.data, this.getError.bind(this), this.acceptTypes),
      ),
      tap((file: FileItem) => this.store.update(file)),
      tap((file: FileItem) => (file.status !== FileItemStatus.error ? this.addUpload(file) : null)),
      map(() => undefined),
    );
  }
  addDownload(file: FileItem): void {
    this.createOperation(OperationType.download, file);
  }
  downloading(operation: Operation): Observable<void> {
    const fileItem = operation.item;
    const { status } = fileItem;
    return of(fileItem).pipe(
      tap((file) => this.store.changeStatus(file, FileItemStatus.downloading)),
      concatMap((file) => this.terabyteService.downloadFile(file.createUploadedParams())),
      tap((result) => {
        this.terabyteService.pushFileToBrowserForDownload(result, fileItem.item);
      }),
      finalize(() => {
        this.store.changeStatus(fileItem, status);
      }),
      map(() => undefined),
    );
  }

  addDelete(file: FileItem): void {
    this.createOperation(OperationType.delete, file);
  }

  delition(operation: Operation): Observable<void> {
    const fileItem = operation.item;
    const { status } = fileItem;
    return of(fileItem).pipe(
      tap((file) => this.store.changeStatus(file, FileItemStatus.delition)),
      concatMap((file) =>
        status === FileItemStatus.uploaded
          ? this.terabyteService.deleteFile(file.createUploadedParams()).pipe(map(() => undefined))
          : of(undefined),
      ),
      catchError((e) => {
        this.store.update(fileItem.setError(this.getError(ErrorActions.addDeletionErr)));
        return throwError(e);
      }),
      tap(() => this.updateUploadingInfo(fileItem, true)),
      tap(() => this.store.remove(fileItem)),
    );
  }

  addUpload(file: FileItem): void {
    this.createOperation(OperationType.upload, file);
  }

  uploading(operation: Operation): Observable<void> {
    const { item } = operation;
    const options = item.createUploadOptions(this.objectId, UPLOAD_OBJECT_TYPE, this.getMnemonic());

    return of(item).pipe(
      tap((file) => this.store.changeStatus(file, FileItemStatus.uploading)),
      tap((file: FileItem) =>
        this.fileUploadService.updateFilesSize(file.raw.size, this.loadData.uploadId),
      ),
      concatMap((file) => this.terabyteService.uploadFile(options, file.raw)),
      catchError((e) => {
        this.store.update(item.setError(this.getError(ErrorActions.addUploadErr)));
        this.fileUploadService.decrementFilesSize(item.raw.size, this.loadData.uploadId);
        return throwError(e);
      }),
      concatMap(() => this.terabyteService.getFileInfo(options)),
      map((upploaded) => {
        item.setItem(upploaded as UploadedFile).setStatus(FileItemStatus.uploaded);
        this.store.update(item);
      }),
      map(() => undefined),
    );
  }

  sendUpdateEvent({ value, errors }: FileResponseToBackendUploadsItem): void {
    this.eventBusService.emit('fileUploadItemValueChangedEvent', {
      uploadId: this.loadData.uploadId,
      value,
      errors,
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

  updateMaxFileNumber(file: UploadedFile): void {
    const index = Number(file.mnemonic.split('.').pop());
    this.maxFileNumber = index > this.maxFileNumber ? index : this.maxFileNumber;
  }

  loadImage(file: FileItem): Observable<FileItem> {
    return !file.isImage
      ? of(file)
      : this.terabyteService.downloadFile(file.createUploadedParams()).pipe(
          catchError((e) => {
            // TODO: Добавить в общий стэк ошибок
            // this.updateFileItem(this.createError(ErrorActions.addDownloadErr, fileItem));
            // this.handleError(ErrorActions.addDownloadErr, { name: file.fileName });
            return throwError(e);
          }),
          map((blob: Blob) =>
            file.setRaw(new File([blob], file.raw.name, { type: file.raw.type })),
          ),
        );
  }

  loadList(): Observable<FileItem> {
    return this.getListStream(this.objectId).pipe(
      map((file) => new FileItem(FileItemStatus.uploaded, null, file)),
      mergeMap((file: FileItem) => this.loadImage(file)),
      tap((file: FileItem) => this.store.add(file)),
      tap((file: FileItem) => this.updateUploadingInfo(file)),
      tap((file: FileItem) => this.updateMaxFileNumber(file.item)),
    );
  }

  ngOnInit(): void {
    this.maxFileNumber = -1;
    this.subscriptions.add(this.loadList().subscribe());
    this.subscriptions.add(this.files$.subscribe());
  }

  polyfillFile(file: File): File {
    const { type, lastModified, name } = file;

    return new FilePonyfill([file], name, {
      type,
      lastModified,
    });
  }

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

  getError(action: ErrorActions): FileItemError {
    const errorHandler = {};
    // errorHandler[
    //   ErrorActions.addMaxTotalAmount
    // ] = `Максимальное количество всех файлов - ${this.fileUploadService.getMaxTotalFilesAmount()}`;

    // errorHandler[ErrorActions.addMaxTotalSize] = `Размер всех файлов превышает ${getSizeInMB(
    //   this.fileUploadService.getMaxTotalFilesSize(),
    // )} МБ`;

    // eslint-disable-next-line prettier/prettier
    // errorHandler[
    //   ErrorActions.addMaxAmount
    // ] = `Максимальное количество файлов для документа - ${this.data.maxFileCount}`;

    // eslint-disable-next-line prettier/prettier
    errorHandler[ErrorActions.addMaxSize] = {
      text: `Файл тяжелее ${getSizeInMB(this.data.maxSize)} МБ`,
      description: `Попробуйте уменьшить размер или загрузите файл полегче`,
    };
    errorHandler[ErrorActions.addInvalidType] = {
      text: `Проверьте формат файла`,
      description: `Попробуйте заменить на другой. Доступны для загрузки ${this.acceptTypes
        .replace(/\./gi, '')
        .replace(/,/gi, ', ')
        .toUpperCase()}`,
    };
    errorHandler[ErrorActions.addInvalidFile] = {
      text: `Файл повреждён`,
      description: `Что-то не так с файлом. Попробуйте заменить на другой`,
    };
    errorHandler[ErrorActions.addDownloadErr] = {
      text: `Ошибка при скачивании`,
      description: `Не удалось скачать файл. Попробуйте снова`,
    };
    errorHandler[ErrorActions.addUploadErr] = {
      text: `Ошибка при загрузке`,
      description: `Попробуйте отправить снова или замените документ.`,
    };
    errorHandler[ErrorActions.addDeletionErr] = {
      text: `Ошибка при удалении`,
      description: `Не получилось удалить файл. Попробуйте снова`,
    };

    return { ...errorHandler[action], type: action };
  }

  updateAcceptTypes(): void {
    this.acceptTypes = !this.data.fileType.length
      ? null
      : this.data.fileType
          .map((fileType) => `.${fileType}`)
          .join(',')
          .toLowerCase();
  }

  updateUploadingInfo(file: FileItem, isDeleted?: boolean): void {
    if (isDeleted) {
      this.fileUploadService.updateFilesAmount(-1, this.loadData.uploadId);
      this.fileUploadService.updateFilesSize(-file.raw.size, this.loadData.uploadId);
    } else {
      this.fileUploadService.updateFilesAmount(1, this.loadData.uploadId);
      this.fileUploadService.updateFilesSize(file.raw.size, this.loadData.uploadId);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
