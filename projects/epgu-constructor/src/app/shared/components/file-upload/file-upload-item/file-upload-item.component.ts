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
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '../../../../core/services/config/config.service';
import { DeviceDetectorService } from '../../../../core/services/device-detector/device-detector.service';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { ModalService } from '../../../../modal/modal.service';
import { TerraByteApiService } from '../../../../core/services/terra-byte-api/terra-byte-api.service';
import {
  Clarifications,
  FileResponseToBackendUploadsItem,
  FileUploadItem,
  UploadedFile,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { CheckFailedReasons, FileUploadService } from '../file-upload.service';
import {
  ErrorActions,
  FileItem,
  FileItemError,
  FileItemStatus,
  FileItemStore,
  getSizeInMB,
  Operation,
  OperationType,
  plurals,
  UPLOAD_OBJECT_TYPE,
} from './data';
import { PrepareService } from '../prepare.service';
import { ScreenService } from '../../../../screen/screen.service';
import { AttachUploadedFilesModalComponent } from '../../../../modal/attach-uploaded-files-modal/attach-uploaded-files-modal.component';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { AutocompleteService } from '../../../../core/services/autocomplete/autocomplete.service';

interface OverLimitsItem {
  count: number;
  isMax: boolean;
}
interface OverLimits {
  totalSize: OverLimitsItem;
  totalAmount: OverLimitsItem;
  amount: OverLimitsItem;
}

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

    this.maxTotalSize = this.fileUploadService.getMaxTotalFilesSize();
    this.maxTotalAmount = this.fileUploadService.getMaxTotalFilesAmount();
    this.updateAcceptTypes();
  }

  plurals = plurals;

  maxTotalSize: number;
  maxTotalAmount: number;
  acceptTypes?: string;

  isMobile: boolean = this.deviceDetectorService.isMobile;
  fileStatus = FileItemStatus;

  listUploadingStatus = new BehaviorSubject<boolean>(false);

  overLimits = new BehaviorSubject<OverLimits>({
    totalSize: { count: 0, isMax: false },
    totalAmount: { count: 0, isMax: false },
    amount: { count: 0, isMax: false },
  });

  processingFiles = new Subject<FileList>(); // Сюда попадают файлы на загрузку

  processingFiles$ = this.processingFiles.pipe(
    tap(() => this.resetLimits()), // Обнуляем каунтеры перебора
    tap(() => this.store.errorTo(ErrorActions.addDeletionErr, FileItemStatus.uploaded)), // Изменяем ошибку удаления на uploaded статус
    tap(() => this.store.removeWithErrorStatus()), // Удаляем все ошибки
    concatMap((files: FileList) => from(Array.from(files))), // разбиваем по файлу
    map(this.polyfillFile.bind(this)), // приводим файл к PonyFillFile
    map(
      (file: File) => new FileItem(FileItemStatus.preparation, this.config.fileUploadApiUrl, file),
    ), // Формируем FileItem
    concatMap(
      (file: FileItem) =>
        this.prepareService.prepare(file, this.data, this.getError.bind(this), this.acceptTypes), // Валидируем файл
    ),
    filter((file: FileItem) => this.limitFilter(file)), // Фильруем по лимитам
    tap((file: FileItem) => this.store.add(file)), // Добавление файла в общий поток
    filter((file: FileItem) => file.status !== FileItemStatus.error), // Далле только без ошибок
    tap((file: FileItem) => this.incrementLimits(file)), // Обновляем лимиты
    tap((file: FileItem) => this.addUpload(file)), // Эвент на згарузку
  );

  store = new FileItemStore();
  componentId = this.screenService.component?.id || null;

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
  suggestions$ = this.screenService.suggestions$;

  get data(): FileUploadItem {
    return this.loadData;
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

  uploadersCounterChanges$ = this.fileUploadService.uploaderChanges.pipe(
    tap(() => this.maxLimitUpdate()),
  );

  subscriptions: Subscription = new Subscription()
    .add(this.processingFiles$.subscribe())
    .add(this.processingOperations$.subscribe())
    .add(this.uploadersCounterChanges$.subscribe());

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
    private screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private autocompleteService: AutocompleteService,
  ) {}

  ngOnInit(): void {
    this.maxFileNumber = -1;
    this.subscriptions.add(this.loadList().subscribe());
    this.subscriptions.add(this.files$.subscribe());

    this.eventBusService
      .on(`fileDeleteEvent_${this.loadData.uploadId}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileItem) => {
        this.addDelete(payload);
      });
    this.eventBusService
      .on(`fileDownloadEvent_${this.loadData.uploadId}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileItem) => {
        this.addDownload(payload);
      });
    this.eventBusService
      .on(`fileSuggestEvent_${this.loadData.uploadId}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: { isAdd: boolean; file: FileItem }) => {
        this.suggest(payload);
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  suggest({ isAdd, file }: { isAdd: boolean; file: FileItem }): void {
    if (isAdd) {
      /* NOTICE: тут образовался небольшой костыль, призванный решить проблему того,
       * что в терабайт должен улетать абсолютно новый инстанс файла для каждого objectId|orderId,
       * чтобы файлы потом корректно загружались в ЛК
       */
      file.setAttached(true);
      this.terabyteService.downloadFile(file.createUploadedParams()).subscribe((blob: Blob) => {
        const rawFile = new File([blob], file.item.fileName);
        const newFile = new FileItem(
          FileItemStatus.preparation,
          this.config.fileUploadApiUrl,
          rawFile,
          { ...file.item, isFromSuggests: true, objectId: this.screenService.orderId.toString() },
        );
        newFile.setAttached(true);
        this.addPrepare(newFile);
        this.store.add(newFile);
      });
    } else {
      file.setAttached(false);
      const storedFile = this.files
        .getValue()
        .find((storeFile) => storeFile.item.fileName === file.item.fileName);
      this.store.remove(storedFile);
      this.addDelete(storedFile);
    }
  }

  resetLimits(): void {
    const limits = { ...this.overLimits.getValue() };
    limits.totalAmount.count = 0;
    limits.totalSize.count = 0;
    limits.amount.count = 0;
    this.overLimits.next(limits);
  }

  limitFilter(file: FileItem): boolean {
    const maxTotalAmount = file?.error?.type === ErrorActions.addMaxTotalAmount;
    const maxTotalSize = file?.error?.type === ErrorActions.addMaxTotalSize;
    const maxAmount = file?.error?.type === ErrorActions.addMaxAmount;
    const limits = { ...this.overLimits.getValue() };
    limits.totalAmount.count = maxTotalAmount
      ? limits.totalAmount.count + 1
      : limits.totalAmount.count;
    limits.totalSize.count = maxTotalSize ? limits.totalSize.count + 1 : limits.totalSize.count;
    limits.amount.count = maxAmount ? limits.amount.count + 1 : limits.amount.count;
    this.overLimits.next(limits);
    return !maxAmount && !maxTotalSize && !maxTotalAmount;
  }

  reduceChanges(
    acc: FileResponseToBackendUploadsItem,
    value: FileItem,
  ): FileResponseToBackendUploadsItem {
    const ignoreActions = [
      ErrorActions.addInvalidType,
      ErrorActions.addInvalidFile,
      ErrorActions.addUploadErr,
    ];
    if (!ignoreActions.includes(value?.error?.type) && value.item) {
      acc.value.push(value.item);
      if (value.error) {
        acc.errors.push(value.error.text);
      }
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

  isPrevUploadedFilesButtonShown(suggestions: ISuggestionItem): boolean {
    if (!suggestions) return false;

    const { list } = suggestions;
    const filteredUploadedFiles = this.autocompleteService
      .getParsedSuggestionsUploadedFiles(list)
      .filter((file: UploadedFile) => file.mnemonic.includes(this.loadData?.uploadId));
    return !!filteredUploadedFiles.length;
  }

  delition(operation: Operation): Observable<void> {
    const fileItem = operation.item;
    const { status } = fileItem;
    return of(fileItem).pipe(
      tap((file: FileItem) => this.store.changeStatus(file, FileItemStatus.delition)),
      concatMap((file) =>
        status === FileItemStatus.uploaded
          ? this.terabyteService.deleteFile(file.createUploadedParams()).pipe(
              tap(() => this.decrementLimits(fileItem)),
              tap(() => this.resetLimits()),
              map(() => undefined),
            )
          : of(undefined),
      ),
      catchError((e) => {
        this.store.update(fileItem.setError(this.getError(ErrorActions.addDeletionErr)));
        return throwError(e);
      }),
      tap(() => this.store.remove(fileItem)),
    );
  }

  addUpload(file: FileItem): void {
    this.createOperation(OperationType.upload, file);
  }

  incrementLimits(file: FileItem): void {
    if (file.limited) {
      return;
    }
    this.updateUploadingInfo(file);
    this.maxLimitUpdate();
    this.store.update(file.setLimited(true));
  }
  decrementLimits(file: FileItem): void {
    if (!file.limited) {
      return;
    }
    this.updateUploadingInfo(file, true);
    this.maxLimitUpdate();
    this.store.update(file.setLimited(false));
  }

  maxLimitUpdate(): void {
    const limits = { ...this.overLimits.getValue() };
    const checkSize = this.fileUploadService.checkFilesSize(1, this.data.uploadId);

    const checkAmount = this.fileUploadService.checkFilesAmount(1, this.data.uploadId);
    limits.totalSize.isMax = checkSize?.reason === CheckFailedReasons.total;
    limits.amount.isMax = checkAmount?.reason === CheckFailedReasons.uploaderRestriction;
    limits.totalAmount.isMax = checkAmount?.reason === CheckFailedReasons.total;
    this.overLimits.next(limits);
  }

  uploading(operation: Operation): Observable<void> {
    const { item } = operation;
    const options = item.createUploadOptions(this.objectId, UPLOAD_OBJECT_TYPE, this.getMnemonic());

    return of(item).pipe(
      tap((file: FileItem) => this.store.changeStatus(file, FileItemStatus.uploading)),
      tap((file: FileItem) => this.incrementLimits(file)),
      concatMap((file) => this.terabyteService.uploadFile(options, file.raw)),
      catchError((e) => {
        this.store.update(item.setError(this.getError(ErrorActions.addUploadErr)));
        this.decrementLimits(item);
        return throwError(e);
      }),
      concatMap(() => this.terabyteService.getFileInfo(options)),
      tap((uploaded) => {
        const newUploaded = uploaded as UploadedFile;
        if (item.item?.isFromSuggests) {
          newUploaded.isFromSuggests = true;
        }
        item.setItem(newUploaded).setStatus(FileItemStatus.uploaded);
        this.store.update(item);
      }),
      map(() => undefined),
    );
  }

  sendUpdateEvent({ value, errors }: FileResponseToBackendUploadsItem): void {
    this.eventBusService.emit('fileUploadItemValueChangedEvent', {
      uploadId: this.loadData.uploadId,
      required: this.loadData?.required ?? true,
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
          file?.mnemonic?.includes(this.getSubMnemonicPath()) &&
          file?.objectId.toString() === this.objectId.toString(),
      ),
      map((file) => {
        let suggestionsFiles;
        this.suggestions$.pipe(take(1)).subscribe((suggestions) => {
          suggestionsFiles = suggestions[this.componentId]?.list;
        });
        const suggestionsUploadedFiles = this.autocompleteService.getParsedSuggestionsUploadedFiles(
          suggestionsFiles,
        );

        if (
          suggestionsUploadedFiles.some(
            (uploadedFile: UploadedFile) => uploadedFile.fileName === file.fileName,
          )
        ) {
          // eslint-disable-next-line no-param-reassign
          file.isFromSuggests = true;
        }

        return file;
      }),
      finalize(() => this.listUploadingStatus.next(false)),
    );
  }

  updateMaxFileNumber(file: UploadedFile): void {
    const index = Number(file.mnemonic.split('.').pop());
    this.maxFileNumber = index > this.maxFileNumber ? index : this.maxFileNumber;
  }

  loadList(): Observable<FileItem> {
    return this.getListStream(this.objectId).pipe(
      map(
        (file) => new FileItem(FileItemStatus.uploaded, this.config.fileUploadApiUrl, null, file),
      ),
      tap((file: FileItem) => this.store.add(file)),
      tap((file: FileItem) => this.incrementLimits(file)),
      tap((file: FileItem) => this.updateMaxFileNumber(file.item)),
    );
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
    // eslint-disable-next-line prettier/prettier
    errorHandler[ErrorActions.addMaxTotalSize] = {
      text: ``,
      description: ``,
    };
    errorHandler[ErrorActions.addMaxAmount] = {
      text: ``,
      description: ``,
    };
    errorHandler[ErrorActions.addMaxTotalAmount] = {
      text: ``,
      description: ``,
    };
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

  attachUploadedFiles(): void {
    this.modal.openModal(AttachUploadedFilesModalComponent, {
      modalId: `${this.loadData.uploadId}`,
      acceptTypes: this.acceptTypes || '',
      showCloseButton: false,
      showCrossButton: true,
      filesList: this.files.getValue(),
    });
  }
}
