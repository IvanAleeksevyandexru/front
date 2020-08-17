import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { getSizeInMB, IFileUploadItem, UploadedFile, uploadObjectType } from './data';
import { TerabyteService } from '../../../../services/rest/terabyte.service';
import { imageCameraQuality } from '../../../../services/config/terabyte.config';

@Component({
  selector: 'app-file-upload-item',
  templateUrl: './file-upload-item.component.html',
  styleUrls: ['./file-upload-item.component.scss'],
})
export class FileUploadItemComponent implements OnDestroy {
  private loadData: IFileUploadItem;
  @Input()
  set data(data: IFileUploadItem) {
    this.loadData = data;
  }
  get data() {
    return this.loadData;
  }
  @Input() prefixForMnemonic: string;
  @Input() objectId: number;

  @ViewChild('fileUploadInput') uploadInput: ElementRef;

  private subs: Subscription[] = [];
  private maxFileNumber = -1;
  imageCameraQuality = imageCameraQuality;
  cameraNotAllowed = false; // Флаг, что камеры нет или она запрещена
  listIsUploadingNow = false; // Флаг, что загружается список ранее прикреплённых файлов
  filesInUploading = 0; // Количество файлов, которое сейчас в состоянии загрузки на сервер
  files: UploadedFile[] = []; // Список уже загруженных файлов
  errors: string[] = [];

  constructor(private terabyteService: TerabyteService) {}

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
   * Возвращает мнемонику для файла, формируя уникальный префикс
   * @private
   */
  private getMnemonic(): string {
    this.maxFileNumber += 1;
    return [this.prefixForMnemonic, this.data.uploadId, this.maxFileNumber].join('.');
  }

  /**
   * Send one file to server
   * @param file - file object to upload
   * @private
   */
  private sendFile(file: File | Blob) {
    this.filesInUploading += 1;
    this.subs.push(
      this.terabyteService
        .uploadFile(
          {
            name: file instanceof File ? file.name : `camera_${this.filesInUploading}.jpg`,
            objectId: this.objectId,
            objectType: uploadObjectType,
            mnemonic: this.getMnemonic(),
          },
          file,
        )
        .pipe(
          catchError((e: any) => {
            this.filesInUploading -= 1;
            return throwError(e);
          }),
        )
        .subscribe((result) => {
          console.log('result', result);
          this.filesInUploading -= 1;
        }),
    );
  }

  /**
   * Обновляет данные о файлах, которые были загружены
   */
  updateFilesInfo() {
    this.errors = [];
    const inputFiles: File[] = this.prepareFilesToUpload(this.uploadInput.nativeElement.files);

    let maxFileCountError = false;
    inputFiles.forEach((file: File) => {
      if (
        !maxFileCountError &&
        this.data.maxFileCount &&
        this.files.length === this.data.maxFileCount
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
  uploadFilesEvent() {
    this.uploadInput.nativeElement.click();
  }

  // /**
  //  * Открытие камеры для получения изображения
  //  */
  // openCamera() {
  //
  // }

  /**
   * Обработка сфотографированной картинки
   *
   * @param $event - событие сфотографированной картинки
   */
  handleWebcamCapture($event: WebcamImage) {
    console.log('$event', $event);
  }

  /**
   * Проверяем ошибки инициализации
   */
  handleCameraInitError(error: WebcamInitError) {
    if (error.mediaStreamError && error.mediaStreamError.name === 'NotAllowedError') {
      // console.warn("Camera access was not allowed by user!");
    }
    this.cameraNotAllowed = true;
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
