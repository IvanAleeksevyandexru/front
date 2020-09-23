import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  FileResponseToBackendUploadsItem,
  FileUploadItem,
  Clarifications,
  TerabyteListItem,
} from '../../../../../../shared/services/terra-byte-api/terra-byte-api.types';
import { TerraByteApiService } from '../../../../../../shared/services/terra-byte-api/terra-byte-api.service';
import { WebcamService } from '../../../../../../shared/services/webcam/webcam.service';
import {
  isCloseAndSaveWebcamEvent,
  isCloseWebcamEvent,
  WebcamEvent,
} from '../../../../../../shared/components/webcam-shoot/webcamevents';
import { getSizeInMB, TerraUploadedFile, UPLOAD_OBJECT_TYPE } from './data';

@Component({
  selector: 'epgu-constructor-file-upload-item',
  templateUrl: './file-upload-item.component.html',
  styleUrls: ['./file-upload-item.component.scss'],
})
export class FileUploadItemComponent implements OnDestroy, OnInit {
  private loadData: FileUploadItem;
  @Input() clarification: Clarifications;
  @Input()
  set data(data: FileUploadItem) {
    this.loadData = data;
    this.listIsUploadingNow = true;
    this.files$$.next([]);
    this.terabyteService
      .getListByObjectId(this.objectId)
      .pipe(
        catchError((e: any) => {
          this.listIsUploadingNow = false;
          return throwError(e);
        }),
      )
      .pipe(
        map((result) => this.filterServerListItemsForCurrentForm(result)),
        map((list: TerabyteListItem[]) => this.transformTerabyteItemsToUploadedFiles(list)),
      )
      .subscribe((list) => {
        this.listIsUploadingNow = false;
        if (list.length) {
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
  @Input() objectId: number;
  @Input() refData: any = null;

  @Output() newValueSet: EventEmitter<FileResponseToBackendUploadsItem> = new EventEmitter<
    FileResponseToBackendUploadsItem
  >();

  @ViewChild('fileUploadInput', {
    static: true,
  })
  uploadInput: ElementRef;

  private subs: Subscription[] = [];
  private maxFileNumber = -1;

  cameraNotAllowed = false; // Флаг, что камеры нет или она запрещена
  listIsUploadingNow = false; // Флаг, что загружается список ранее прикреплённых файлов
  filesInUploading = 0; // Количество файлов, которое сейчас в состоянии загрузки на сервер
  files$$ = new BehaviorSubject<TerraUploadedFile[]>([]); // Список уже загруженных файлов
  files$ = this.files$$
    .asObservable()
    .pipe(
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

  constructor(private terabyteService: TerraByteApiService, private webcamService: WebcamService) {}

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
    if (uploaded) {
      this.terabyteService
        .getFileInfo(uploadedFile.getParamsForFileOptions())
        .subscribe((result: TerabyteListItem) => {
          this.setFileInfoUploaded(uploadedFile, result.fileSize, uploaded);
        });
    } else {
      this.setFileInfoUploaded(uploadedFile, 0, uploaded);
    }
  }

  /**
   * Отправляет файл на сервер
   * @param file - file object to upload
   * @private
   */
  private sendFile(file: File | Blob) {
    this.filesInUploading += 1;

    const fileToUpload = new TerraUploadedFile({
      fileName: file instanceof File ? file.name : `camera_${this.filesInUploading}.jpg`,
      objectId: this.objectId,
      objectTypeId: UPLOAD_OBJECT_TYPE,
      mnemonic: this.getMnemonic(),
    });
    const files = this.files$$.value;
    files.push(fileToUpload);
    this.files$$.next(files);
    this.subs.push(
      this.terabyteService
        .uploadFile(fileToUpload.getParamsForUploadFileOptions(), file)
        .pipe(
          catchError((e: any) => {
            this.filesInUploading -= 1;
            this.updateFileInfoFromServer(fileToUpload, false);
            return throwError(e);
          }),
        )
        .subscribe(() => {
          this.filesInUploading -= 1;
          this.updateFileInfoFromServer(fileToUpload);
        }),
    );
  }

  /**
   * Подготавливает файлы на загрузку и возращает итоговый проверенный
   * список для загрузки и добавления в общий список загружаемых файлов
   * @param newFilesToUpload
   * @private
   */
  private prepareFilesToUpload(newFilesToUpload: FileList): File[] {
    const files: File[] = [];
    Array.from(newFilesToUpload).forEach((fileToAdd: File) => {
      if (fileToAdd.size > this.data.maxSize) {
        this.errors.push(
          `Размер файла "${fileToAdd.name}" превышает ${getSizeInMB(this.data.maxSize)} МБ`,
        );
      } else {
        files.push(fileToAdd);
      }
    });

    return files;
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
          catchError((e: any) => {
            this.filesInUploading -= 1;
            return throwError(e);
          }),
        )
        .subscribe(() => {
          this.filesInUploading -= 1;
          let files = this.files$$.value;
          files = files.filter((f) => f.mnemonic !== file.mnemonic);
          this.files$$.next(files);
        });
    } else {
      let files = this.files$$.value;
      files = files.filter((f) => f.mnemonic !== file.mnemonic);
      this.files$$.next(files);
    }
  }

  /**
   * Обновляет данные о файлах, которые были загружены
   */
  updateSelectedFilesInfoAndSend() {
    this.errors = [];
    const inputFiles: File[] = this.prepareFilesToUpload(this.uploadInput.nativeElement.files);

    let maxFileCountError = false;
    inputFiles.forEach((file: File) => {
      if (!maxFileCountError) {
        if (this.data.maxFileCount && this.files$$.value.length === this.data.maxFileCount) {
          maxFileCountError = true;
          this.errors.push(`Максимальное число файлов на загрузку - ${this.data.maxFileCount}`);
        } else {
          this.sendFile(file);
        }
      }
    });
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
    this.errors = [];
    if (this.data.maxFileCount && this.files$$.value.length === this.data.maxFileCount) {
      this.errors.push(`Максимальное число файлов на загрузку - ${this.data.maxFileCount}`);
    } else {
      const webcamEvents = this.webcamService.open();
      webcamEvents.events.subscribe((event: WebcamEvent) => {
        if (isCloseWebcamEvent(event) || isCloseAndSaveWebcamEvent(event)) {
          if (isCloseAndSaveWebcamEvent(event)) {
            // Если данные нужно сохранить и отправить
            const { data } = event;
            this.sendFile(TerraByteApiService.base64toBlob(data));
          }
          this.webcamService.close();
        }
      });
    }
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

  ngOnInit(): void {
    this.webcamService.isWebcamAllowed().subscribe((isAvailable) => {
      this.cameraNotAllowed = isAvailable;
    });
  }
}
