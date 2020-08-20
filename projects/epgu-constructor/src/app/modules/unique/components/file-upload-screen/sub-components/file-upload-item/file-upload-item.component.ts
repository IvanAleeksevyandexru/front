import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WebcamInitError } from 'ngx-webcam';
import {
  getSizeInMB,
  IFileUploadItem,
  TERABYTE_TEST_TOKEN,
  TerrabyteListItem,
  UploadedFile,
  uploadObjectType,
} from './data';
import { TerabyteService } from '../../../../../../services/rest/terabyte.service';
import { UtilsService } from '../../../../../../services/utils/utils.service';
import { WebcamService } from '../../../../../../services/utils/webcam.service';
import {
  isCloseAndSaveWebcamEvent,
  isCloseWebcamEvent,
  WebcamEvent,
} from '../../../../../../services/utils/webcamevents';

@Component({
  selector: 'app-file-upload-item',
  templateUrl: './file-upload-item.component.html',
  styleUrls: ['./file-upload-item.component.scss'],
})
export class FileUploadItemComponent implements OnDestroy, OnInit {
  private loadData: IFileUploadItem;
  @Input()
  set data(data: IFileUploadItem) {
    this.loadData = data;
    this.listIsUploadingNow = true;
    this.files$.next([]);
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
        map((list: TerrabyteListItem[]) => this.transformTerrabyteItemsToUploadedFiles(list)),
      )
      .subscribe((list) => {
        this.listIsUploadingNow = false;
        if (list.length) {
          // eslint-disable-next-line no-console
          console.log('list', list);
          this.files$.next([...list]);
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

  @ViewChild('fileUploadInput', {
    static: true,
  })
  uploadInput: ElementRef;

  private subs: Subscription[] = [];
  private maxFileNumber = -1;

  cameraNotAllowed = false; // Флаг, что камеры нет или она запрещена
  listIsUploadingNow = false; // Флаг, что загружается список ранее прикреплённых файлов
  filesInUploading = 0; // Количество файлов, которое сейчас в состоянии загрузки на сервер
  files$: BehaviorSubject<UploadedFile[]> = new BehaviorSubject<UploadedFile[]>([]); // Список уже загруженных файлов
  errors: string[] = [];

  constructor(private terabyteService: TerabyteService, private webcamService: WebcamService) {}

  /**
   * Переводит список файлов с сервера в файлы для отображения
   * @param list - массив информациио файлах на сервере
   * @private
   */
  private transformTerrabyteItemsToUploadedFiles(list: TerrabyteListItem[]): UploadedFile[] {
    const filesList: UploadedFile[] = [];
    if (list.length) {
      list.forEach((terraFile: TerrabyteListItem) => {
        const file = new UploadedFile(terraFile);
        file.uploaded = true;
        filesList.push(file);
      });
    }
    return filesList;
  }

  /**
   * Фильтрует список файлов полученных с сервера, чтобы были только для этой формы
   * @param result - список файлов, хранящихся на сервере
   * @private
   */
  private filterServerListItemsForCurrentForm(result: TerrabyteListItem[]): TerrabyteListItem[] {
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
  private setFileInfoUploaded(uploadedFile: UploadedFile, fileSize: number, uploaded: boolean) {
    const files = this.files$.value;
    files.forEach((f: UploadedFile) => {
      if (f.mnemonic === uploadedFile.mnemonic) {
        // eslint-disable-next-line no-param-reassign
        f.uploaded = uploaded;
        // eslint-disable-next-line no-param-reassign
        f.hasError = !uploaded;
        // eslint-disable-next-line no-param-reassign
        f.fileSize = fileSize;
      }
    });
    this.files$.next(files);
  }

  /**
   * Подгружает информацию с сервера
   *
   * @param uploadedFile - файл предварительно загруженный на сервер
   * @param uploaded - признак что файл загружен
   * @private
   */
  private updateFileInfoFromServer(uploadedFile: UploadedFile, uploaded: boolean = true) {
    if (uploaded) {
      this.terabyteService
        .getFileInfo(uploadedFile.getParamsForFileOptions())
        .subscribe((result: TerrabyteListItem) => {
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

    const fileToUpload = new UploadedFile({
      fileName: file instanceof File ? file.name : `camera_${this.filesInUploading}.jpg`,
      objectId: this.objectId,
      objectTypeId: uploadObjectType,
      mnemonic: this.getMnemonic(),
    });
    const files = this.files$.value;
    files.push(fileToUpload);
    this.files$.next(files);
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
  private prepareFilesToUpload(newFilesToUpload: File[]): File[] {
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
  private getMaxFileNumberFromList(list: UploadedFile[]): number {
    let maxIndex = -1;
    list.forEach((f) => {
      const index = Number(f.mnemonic.split('.').pop());
      if (index > maxIndex) {
        maxIndex = index;
      }
    });
    return maxIndex;
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
  deleteFile(file: UploadedFile) {
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
          let files = this.files$.value;
          files = files.filter((f) => f.mnemonic !== file.mnemonic);
          this.files$.next(files);
        });
    } else {
      let files = this.files$.value;
      files = files.filter((f) => f.mnemonic !== file.mnemonic);
      this.files$.next(files);
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
      if (
        !maxFileCountError &&
        this.data.maxFileCount &&
        this.files$.value.length === this.data.maxFileCount
      ) {
        maxFileCountError = true;
        this.errors.push(`Максимальное число файлов на загрузку - ${this.data.maxFileCount}`);
      }
      // console.log(maxFileCountError);
      if (!maxFileCountError) {
        this.sendFile(file);
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
    if (this.data.maxFileCount && this.files$.value.length === this.data.maxFileCount) {
      this.errors.push(`Максимальное число файлов на загрузку - ${this.data.maxFileCount}`);
    } else {
      const webcamEvents = this.webcamService.open();
      webcamEvents.events.subscribe((event: WebcamEvent) => {
        if (isCloseWebcamEvent(event) || isCloseAndSaveWebcamEvent(event)) {
          if (isCloseAndSaveWebcamEvent(event)) {
            // Если данные нужно сохранить и отправить
            const { data } = event;
            this.sendFile(TerabyteService.base64toBlob(data, ''));
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
  downloadFile(file: UploadedFile) {
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

  /**
   * Проверяем ошибки инициализации
   */
  handleCameraInitError(error: WebcamInitError) {
    if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
      // eslint-disable-next-line no-console
      console.info('Camera access was not allowed by user!');
    }
    this.cameraNotAllowed = true;
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    UtilsService.setCookie('acc_t', TERABYTE_TEST_TOKEN, 14);
  }
}
