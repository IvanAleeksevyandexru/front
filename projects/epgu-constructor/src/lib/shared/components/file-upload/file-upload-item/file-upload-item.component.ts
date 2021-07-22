import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import FilePonyfill from '@tanker/file-ponyfill';

import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { concatMap, filter, map, reduce, takeUntil, tap } from 'rxjs/operators';
import { Clarifications } from '@epgu/epgu-constructor-types';

import {
  ModalService,
  DeviceDetectorService,
  EventBusService,
  UnsubscribeService,
  ConfigService,
} from '@epgu/epgu-constructor-ui-kit';

import { TerraByteApiService } from '../../../../core/services/terra-byte-api/terra-byte-api.service';
import {
  FileResponseToBackendUploadsItem,
  FileUploadItem,
  UploadedFile,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';

import {
  beforeFilesPlural,
  ErrorActions,
  extToLowerCase,
  FileItem,
  FileItemStatus,
  OperationType,
  plurals,
} from '../data';

import { ScreenService } from '../../../../screen/screen.service';
import { AttachUploadedFilesModalComponent } from '../../../../modal/attach-uploaded-files-modal/attach-uploaded-files-modal.component';

import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { AutocompletePrepareService } from '../../../../core/services/autocomplete/autocomplete-prepare.service';
import { UploaderManagerService } from '../services/manager/uploader-manager.service';
import { UploaderStoreService } from '../services/store/uploader-store.service';
import { UploaderProcessService } from '../services/process/uploader-process.service';
import { UploaderLimitsService } from '../services/limits/uploader-limits.service';
import { UploaderValidationService } from '../services/validation/uploader-validation.service';
import { UploaderStatService } from '../services/stat/uploader-stat.service';

@Component({
  selector: 'epgu-constructor-file-upload-item',
  templateUrl: './file-upload-item.component.html',
  styleUrls: ['./file-upload-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadItemComponent implements OnInit, OnDestroy {
  @Input() clarification: Clarifications;
  @Input() set initFiles(files: UploadedFile[]) {
    this.uploader.maxFileNumber = -1;
    this.initFilesList.next(files);
  }
  get data(): FileUploadItem {
    return this.uploader.data;
  }
  initFilesList = new BehaviorSubject<UploadedFile[]>(null);
  initFilesList$ = this.initFilesList.pipe(
    filter((files) => !!files),
    concatMap((files) => this.loadList(files)),
  );

  plurals = plurals;
  beforeFilesPlural = beforeFilesPlural;
  componentId = this.screenService.component?.id || null;
  isMobile: boolean = this.deviceDetectorService.isMobile;

  overLimits = this.stat.stats;

  processingFiles = new Subject<FileList>(); // Сюда попадают файлы на загрузку

  processingFiles$ = this.processingFiles.pipe(
    tap(() => this.stat.resetLimits()), // Обнуляем каунтеры перебора
    tap(() => this.store.errorTo(ErrorActions.addDeletionErr, FileItemStatus.uploaded)), // Изменяем ошибку удаления на uploaded статус
    tap(() => this.store.removeWithErrorStatus([ErrorActions.serverError])), // Удаляем все ошибки
    concatMap((files: FileList) => from(Array.from(files))), // разбиваем по файлу
    map(this.polyfillFile.bind(this)), // приводим файл к PonyFillFile
    map(
      (file: File) => new FileItem(FileItemStatus.preparation, this.config.fileUploadApiUrl, file),
    ), // Формируем FileItem
    concatMap(
      (file: FileItem) => this.validation.prepare(file), // Валидируем файл
    ),
    filter((file: FileItem) => this.stat.amountFilter(file)), // Фильруем по лимитам
    tap((file: FileItem) => this.store.add(file)), // Добавление файла в общий поток
    filter((file: FileItem) => file.status !== FileItemStatus.error), // Далле только без ошибок
    tap((file: FileItem) => this.stat.incrementLimits(file)), // Обновляем лимиты
    tap((file: FileItem) => this.addUpload(file)), // Эвент на згарузку
  );

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

  uploadersCounterChanges$ = this.limits.changes.pipe(tap(() => this.stat.maxLimitUpdate()));

  processingStatus$ = this.process.processing$.pipe(
    tap((status) => {
      this.eventBusService.emit('UPLOADER_PROCESSING_STATUS', {
        uploadId: this.data.uploadId,
        status,
      });
    }),
  );

  subscriptions: Subscription = new Subscription()
    .add(this.uploader.data$.subscribe())
    .add(this.files$.subscribe())
    .add(this.initFilesList$.subscribe())
    .add(this.process.stream$.subscribe())
    .add(this.processingFiles$.subscribe())
    .add(this.processingStatus$.subscribe())
    .add(this.uploadersCounterChanges$.subscribe());

  constructor(
    public config: ConfigService,
    public modal: ModalService,
    public uploader: UploaderManagerService,
    private terabyteService: TerraByteApiService,
    private deviceDetectorService: DeviceDetectorService,
    private eventBusService: EventBusService,
    private screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private autocompletePrepareService: AutocompletePrepareService,
    private limits: UploaderLimitsService,
    private stat: UploaderStatService,
    private store: UploaderStoreService,
    private validation: UploaderValidationService,
    private process: UploaderProcessService,
  ) {}

  ngOnInit(): void {
    this.eventBusService
      .on(`fileDeleteEvent_${this.uploader.data.uploadId}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileItem) => {
        this.addDelete(payload);
      });
    this.eventBusService
      .on(`fileDownloadEvent_${this.uploader.data.uploadId}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileItem) => {
        this.addDownload(payload);
      });
    this.eventBusService
      .on(`fileSuggestEvent_${this.uploader.data.uploadId}`)
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

  reduceChanges(
    acc: FileResponseToBackendUploadsItem,
    value: FileItem,
  ): FileResponseToBackendUploadsItem {
    const ignoreActions = [ErrorActions.addDeletionErr, ErrorActions.addDownloadErr];
    const blockActions = [ErrorActions.serverError];
    const availableErrorCondition = value?.error && ignoreActions.includes(value?.error?.type);

    if ((availableErrorCondition || !value?.error) && value.item) {
      acc.value.push(value.item);
    }
    if (blockActions.includes(value?.error?.type)) {
      acc.errors.push(value.error.text);
    }
    return acc;
  }

  update(fileItem: FileItem): void {
    this.addPrepare(fileItem);
  }

  repeat(file: FileItem): void {
    const files = this.store.files.getValue();
    files.forEach((item) =>
      item?.error?.type === file?.error?.type ? this.addPrepare(item) : null,
    );
  }

  addPrepare(file: FileItem): void {
    this.process.prepare(file);
  }

  addDownload(file: FileItem): void {
    this.process.download(file);
  }

  addDelete(file: FileItem): void {
    this.process.delete(file);
  }
  cancel(type: OperationType, file: FileItem): void {
    this.process.cancel(type, file);
  }

  isPrevUploadedFilesButtonShown(suggestions: ISuggestionItem): boolean {
    if (!suggestions) return false;

    const { list } = suggestions;
    const filteredUploadedFiles = this.autocompletePrepareService
      .getParsedSuggestionsUploadedFiles(list)
      .filter((file: UploadedFile) => file.mnemonic.includes(this.uploader.data?.uploadId));
    return !!filteredUploadedFiles.length;
  }

  addUpload(file: FileItem): void {
    this.process.upload(file);
  }

  isShownDivider(): boolean {
    return this.files.getValue().length > 0;
  }

  sendUpdateEvent({ value, errors }: FileResponseToBackendUploadsItem): void {
    this.eventBusService.emit('fileUploadItemValueChangedEvent', {
      uploadId: this.uploader.data.uploadId,
      required: this.uploader.data?.required ?? true,
      value,
      errors,
    } as FileResponseToBackendUploadsItem);
  }

  selectFiles(fileList: FileList): void {
    this.processingFiles.next(fileList);
  }

  loadList(files: UploadedFile[]): Observable<FileItem> {
    return from(files).pipe(
      map(
        (file) => new FileItem(FileItemStatus.uploaded, this.config.fileUploadApiUrl, null, file),
      ),
      map((file: FileItem) => this.validation.checkServerError(file)),
      tap((file: FileItem) => this.store.add(file)),
      tap((file: FileItem) => this.validation.checkAndSetMaxCountByTypes(file)),
      tap((file: FileItem) => this.stat.incrementLimits(file)),
      tap((file: FileItem) => this.uploader.updateMaxFileNumber(file.item)),
      tap(() => this.stat.updateLimits()),
    );
  }

  polyfillFile(file: File): File {
    const { type, lastModified, name } = file;

    return new FilePonyfill([file], extToLowerCase(name), {
      type,
      lastModified,
    });
  }

  attachUploadedFiles(): void {
    this.modal.openModal(AttachUploadedFilesModalComponent, {
      modalId: `${this.uploader.data.uploadId}`,
      acceptTypes: this.uploader.acceptTypes || '',
      showCloseButton: false,
      showCrossButton: true,
      filesList: this.files.getValue(),
    });
  }
}
