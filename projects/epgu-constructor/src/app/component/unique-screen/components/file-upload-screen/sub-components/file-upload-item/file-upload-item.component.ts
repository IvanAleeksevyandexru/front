import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
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

enum ErrorActions {
  clear = 'clear',
  addMaxSize = 'maxSize',
  addMaxAmount = 'maxAmount',
  addInvalidType = 'invalidType',
}

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
  ) {
    this.isMobile = deviceDetectorService.isMobile;
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

  /**
   * Отправляет файл на сервер
   * @param source - file object to upload
   * @private
   */
  private async sendFile(source: File | Blob) {
    this.filesInUploading += 1;

    let file: any = source;
    if (this.compressTypes.includes(file.type)) {
      file = await this.compressionService.imageCompression(file, {
        maxSizeMB: getSizeInMB(maxImgSizeInBytes),
      });
    }

    const fileToUpload = new TerraUploadedFile({
      fileName: file.name ? file.name : `camera_${this.filesInUploading}.jpg`,
      objectId: this.objectId,
      objectTypeId: UPLOAD_OBJECT_TYPE,
      mnemonic: this.getMnemonic(),
    });

    const files = this.files$$.value;
    const filesSize = this.getFilesSize(files);

    if (filesSize + file.size > this.data.maxSize) {
      this.handleError(ErrorActions.addMaxSize);
      this.filesInUploading -= 1;
      return;
    }

    files.push(fileToUpload);
    this.files$$.next(files);
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
  private prepareFilesToUpload(filesToUpload: FileList, isPhoto?: boolean): File[] {
    this.handleError(ErrorActions.clear);
    const files = isPhoto ? Array.from(filesToUpload) : this.filterValidFiles(filesToUpload);

    if (files.length > this.uploadedFilesAmount) {
      this.handleError(ErrorActions.addMaxAmount);
      return [];
    }

    return files;
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

  getFilesSize(files: TerraUploadedFile[]): number {
    let totalSize = this.uploadedFilesSize;
    files.forEach((file: TerraUploadedFile) => {
      if (/^image/.test(file.fileName)) {
        totalSize += file.fileSize <= maxImgSizeInBytes ? file.fileSize : maxImgSizeInBytes;
      } else {
        totalSize += file.fileSize;
      }
    });
    return totalSize;
  }

  handleError(action: ErrorActions, file?: File): void {
    switch (action) {
      case ErrorActions.addMaxAmount:
        this.errors.push(`Максимальное число файлов на загрузку - ${this.data.maxFileCount}`);
        break;
      case ErrorActions.addMaxSize:
        this.errors.push(`Размер файлов превышает ${getSizeInMB(this.data.maxSize)} МБ`);
        break;
      case ErrorActions.clear:
        this.errors = [];
        break;
      case ErrorActions.addInvalidType:
        this.errors.push(`Недопустимый тип файла "${file?.name}"`);
        break;
      default:
        break;
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
    const files: File[] = this.prepareFilesToUpload(fileList, isPhoto);

    files.forEach((file: File) => this.sendFile(file));
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
