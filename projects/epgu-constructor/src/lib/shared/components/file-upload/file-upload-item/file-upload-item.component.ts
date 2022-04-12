import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, from, Observable, Subject, Subscription } from 'rxjs';
import { concatMap, filter, map, reduce, takeUntil, tap } from 'rxjs/operators';
import { Clarifications } from '@epgu/epgu-constructor-types';
import {
  BaseComponent,
  BusEventType,
  ConfigService,
  DeviceDetectorService,
  EventBusService,
  ModalService,
  UnsubscribeService,
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
import { UploaderManagerService } from '../services/manager/uploader-manager.service';
import { UploaderStoreService } from '../services/store/uploader-store.service';
import { UploaderProcessService } from '../services/process/uploader-process.service';
import { UploaderLimitsService } from '../services/limits/uploader-limits.service';
import { UploaderValidationService } from '../services/validation/uploader-validation.service';
import { UploaderStatService } from '../services/stat/uploader-stat.service';
import { UploadingFile } from '../../uploader/components/uploader/uploader.component';
import { FileUploadPreviewComponent } from '../file-upload-preview/file-upload-preview.component';
import { UploaderButtonComponent } from '../../uploader/components/uploader-button/uploader-button.component';

@Component({
  selector: 'epgu-constructor-file-upload-item',
  templateUrl: './file-upload-item.component.html',
  styleUrls: ['./file-upload-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadItemComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() clarification: Clarifications;
  @Input() set initFiles(files: UploadedFile[]) {
    this.uploader.maxFileNumber = -1;
    this.initFilesList.next(files);
  }
  @Input() galleryFiles$: Observable<UploadedFile[]> = new BehaviorSubject([]);

  @ViewChild('takePhoto', { static: false })
  takePhoto: UploaderButtonComponent;

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
  isGalleryFilesButtonShown = false;

  overLimits = this.stat.stats;

  processingFiles = new Subject<FileList>(); // Сюда попадают файлы на загрузку

  public filesDivider: boolean;

  processingFiles$ = this.processingFiles.pipe(
    tap(() => this.stat.resetLimits()), // Обнуляем каунтеры перебора
    tap(() => this.store.errorTo(ErrorActions.addDeletionErr, FileItemStatus.uploaded)), // Изменяем ошибку удаления на uploaded статус
    tap(() => this.store.removeWithErrorStatus([ErrorActions.serverError])), // Удаляем все ошибки
    concatMap((files: FileList) => from(Array.from(files))), // разбиваем по файлу
    map((file: File) => this.formatExt(file)),
    map(
      (file: File) => new FileItem(FileItemStatus.preparation, this.config.fileUploadApiUrl, file),
    ), // Формируем FileItem
    concatMap(
      (file: FileItem) => this.validation.prepare(file), // Валидируем файл
    ),
    filter((file: FileItem) => this.stat.amountFilter(file)), // Фильтруем по лимитам
    tap((file: FileItem) => this.store.add(file)), // Добавление файла в общий поток
    filter((file: FileItem) => file.status !== FileItemStatus.error), // Далее только без ошибок
    tap((file: FileItem) => this.stat.incrementLimits(file)), // Обновляем лимиты
    tap((file: FileItem) => this.addUpload(file)), // Эвент на загрузку
  );

  files = this.store.files;
  files$ = this.files.pipe(
    tap((files) => (this.filesDivider = !!files.length)),
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

  uploadersCounterChanges$ = this.limits.changes.pipe(tap(() => this.stat.maxLimitUpdate()));

  processingStatus$ = this.process.processing$.pipe(
    tap((status) => {
      this.eventBusService.emit(BusEventType.UploaderProcessingStatus, {
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
    private limits: UploaderLimitsService,
    private stat: UploaderStatService,
    private store: UploaderStoreService,
    private validation: UploaderValidationService,
    private process: UploaderProcessService,
    private cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  formatExt(file: File): File {
    return new File([file.slice(0, file.size, file.type)], extToLowerCase(file.name), {
      type: file.type,
    });
  }

  ngOnInit(): void {
    // TODO Добавить динамическое значение в enum BusEventType после обновления typescript
    this.eventBusService
      .on(`fileDeleteEvent_${this.uploader.data.uploadId}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileItem) => {
        this.addDelete(payload);
      });
    // TODO Добавить динамическое значение в enum BusEventType после обновления typescript
    this.eventBusService
      .on(`fileDownloadEvent_${this.uploader.data.uploadId}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileItem) => {
        this.addDownload(payload);
      });
    // TODO Добавить динамическое значение в enum BusEventType после обновления typescript
    this.eventBusService
      .on(`fileSuggestEvent_${this.uploader.data.uploadId}`)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: { isAdd: boolean; file: FileItem }) => {
        this.suggest(payload);
      });

    this.galleryFiles$.subscribe((files) => {
      this.isGalleryFilesButtonShown = !!files.length;
      this.cdRef.markForCheck();
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
        this.store.add(newFile);
        this.addCopy(file, newFile);
      });
    } else {
      file.setAttached(false);
      const storedFile = this.files
        .getValue()
        .find((storeFile) => storeFile.item.fileName === file.item.fileName);
      this.store.remove(storedFile);
      this.addDelete(storedFile);
      this.stat.decrementLimitByFileItem(file);
    }
  }

  reduceChanges(
    acc: FileResponseToBackendUploadsItem,
    value: FileItem,
  ): FileResponseToBackendUploadsItem {
    const ignoreActions = [ErrorActions.addDeletionErr, ErrorActions.addDownloadErr];
    const blockActions = [ErrorActions.serverError, ErrorActions.addCopyErr];
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
    files.forEach((item) => {
      if (item?.error?.type === file?.error?.type) {
        if (file?.error?.type === ErrorActions.addCopyErr) {
          this.suggest({ isAdd: false, file });
          this.suggest({ isAdd: true, file });
        } else {
          this.addPrepare(item);
        }
      }
    });
  }

  addPrepare(file: FileItem): void {
    this.process.prepare(file);
  }

  addCopy(file: FileItem, newFile: FileItem): void {
    this.process.copy(file, newFile);
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

  addUpload(file: FileItem): void {
    this.process.upload(file);
  }

  sendUpdateEvent({ value, errors }: FileResponseToBackendUploadsItem): void {
    this.eventBusService.emit(BusEventType.FileUploadItemValueChangedEvent, {
      uploadId: this.uploader.data.uploadId,
      required: this.uploader.data?.required ?? true,
      value,
      errors,
    } as FileResponseToBackendUploadsItem);
  }

  selectFileByStatus(event: UploadingFile, status: boolean | null): void {
    if (status !== null) {
      if (status) {
        this.processingFiles.next(event.files);
      } else {
        this.takePhoto?.click();
      }
    }
  }

  selectFiles(event: UploadingFile): void {
    if (
      this.uploader.data?.isPreviewPhoto &&
      event?.action === 'photo' &&
      event.files.length === 1
    ) {
      this.modal
        .openModal<{ changeImage?: boolean; imageObjectUrl?: string } | boolean>(
          FileUploadPreviewComponent,
          {
            imageObjectUrl: window.URL.createObjectURL(event.files[0]),
          },
        )
        .subscribe((status: boolean) => this.selectFileByStatus(event, status));
      return;
    }
    this.processingFiles.next(event.files);
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

  openGalleryFilesModal(): void {
    this.modal.openModal(AttachUploadedFilesModalComponent, {
      modalId: `${this.uploader.data.uploadId}`,
      acceptTypes: this.uploader.acceptTypes || '',
      showCloseButton: false,
      showCrossButton: true,
      filesList: this.files.getValue(),
      galleryFilesList$: this.galleryFiles$,
    });
  }
}
