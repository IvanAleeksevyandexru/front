import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, range, from, combineLatest, of } from 'rxjs';
import { ConfigService, HealthService } from '@epgu/epgu-constructor-ui-kit';
import * as FileSaver from 'file-saver';
import { concatMap, map, mergeMap, reduce, tap } from 'rxjs/operators';
import {
  Chunk,
  ChunkPacket,
  FileCopyEmitValue,
  TerraFileOptions,
  TerraUploadFileOptions,
  UploadedFile,
} from './terra-byte-api.types';
import { BYTES_IN_KB, FileItem } from '../../../shared/components/file-upload/data';
import { RequestStatus } from '@epgu/epgu-constructor-types';

/**
 * Сервис для обмена файлами с сервисом терабайт
 */
@Injectable()
export class TerraByteApiService {
  chunkSize = 6 * BYTES_IN_KB * BYTES_IN_KB; // кол-во в мб

  chunkPacketMaxSize = 1;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private health: HealthService,
  ) {}

  /**
   * Переводит base64 картинку в Blob
   * @param base64Data - base64 закодированная строка
   * @param fileType - custom file type
   */
  static base64toBlob(base64Data: string, fileType?: string): Blob {
    const parts = base64Data.split(';base64,');
    const imageType = fileType || parts[0].split(':')[1];
    const decodedData = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(decodedData.length);

    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: imageType });
  }

  /**
   * Возвращает список файлов, для определённого объекта
   * @param objectId - идентификатор объекта
   */
  getListByObjectId(objectId: string): Observable<UploadedFile[]> {
    return this.http.get<UploadedFile[]>(
      this.getTerabyteApiUrl(`/${objectId}`),
      this.getServerRequestOptions(),
    );
  }

  /**
   * Возвращает список файлов из галереи (ака саджетс-файлы), для определённой мнемоники
   * @param mnemonic - строковый идентификатор мнемоники
   */
  getGalleryByMnemonic(mnemonic: string): Observable<UploadedFile[]> {
    return this.http.get<UploadedFile[]>(
      this.getGalleryApiUrl(`/${mnemonic}`),
      this.getServerRequestOptions(),
    );
  }

  /**
   * Возвращает информацию по файлу
   * @param options - параметры для получения файла
   */
  getFileInfo(options: TerraFileOptions): Observable<UploadedFile> {
    this.health.measureStart('getFileInfoApi');
    return this.http
      .get<UploadedFile>(
        this.getTerabyteApiUrl(
          `/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`,
        ),
        this.getServerRequestOptions(),
      )
      .pipe(tap(() => this.health.measureEnd('getFileInfoApi', RequestStatus.Succeed, options)));
  }

  uploadForm(form: FormData): Observable<void> {
    return this.http.post<void>(
      this.getTerabyteApiUrl('/upload'),
      form,
      this.getServerRequestOptions(),
    );
  }

  createChunk([chunk, chunks, file, options]: [
    number,
    number,
    File | Blob,
    TerraUploadFileOptions,
  ]): Chunk {
    const endIndex = chunk + 1;
    const start = chunk * this.chunkSize;
    const end = endIndex === chunks ? file.size : endIndex * this.chunkSize;
    return {
      form: this.createFormData({ ...options, chunks, chunk }, file.slice(start, end)),
      chunk,
    };
  }

  accumuleChunkPacket(acc: ChunkPacket[], value: Chunk): ChunkPacket[] {
    if (value.chunk === 0) {
      acc.push([value.form]); // часть с 0 байтом должна быть отправлена первой
      return acc;
    }
    if (acc.length === 1) {
      acc.push([]); // запрещаем добавлять в 1 часть
    }
    if (acc[acc.length - 1].length === this.chunkPacketMaxSize) {
      // максимум параллельно запсукаемых элементов
      acc.push([]);
    }
    acc[acc.length - 1].push(value.form);
    return acc;
  }

  uploadByChunkFile(options: TerraUploadFileOptions, file: File | Blob): Observable<void> {
    const chunks = Math.ceil(file.size / this.chunkSize);

    return range(0, chunks).pipe(
      concatMap((index) => combineLatest([of(index), of(chunks), of(file), of(options)])),
      map(this.createChunk.bind(this)),
      reduce<Chunk, ChunkPacket[]>(this.accumuleChunkPacket.bind(this), []),
      concatMap((streams) => from(streams)),
      concatMap((formList) =>
        from(formList).pipe(mergeMap((form) => this.uploadForm(form as FormData))),
      ),
      reduce((acc) => acc, undefined),
    );
  }

  /**
   * Загружает файл на сервер
   * @param options - опции для отправки файла
   * @param file - данные файла
   */
  uploadFile(options: TerraUploadFileOptions, file: File | Blob): Observable<void> {
    this.health.measureStart('uploadFileApi');
    return (file.size <= this.chunkSize
      ? this.uploadForm(this.createFormData(options, file))
      : this.uploadByChunkFile(options, file)
    ).pipe(tap(() => this.health.measureEnd('uploadFileApi', RequestStatus.Succeed, options)));
  }

  /**
   * Копирование файла на сервер
   * @param options - опции конечного файла
   * @param storedFile - данные и опции начального файла
   */
  copyFile(options: TerraUploadFileOptions, storedFile: FileItem): Observable<void> {
    this.health.measureStart('copyFileApi');
    const body: FileCopyEmitValue = {
      data: [
        {
          srcFile: {
            objectId: +storedFile.item.objectId,
            mnemonic: storedFile.item.mnemonic,
            objectType: storedFile.item.objectType,
          },
          trgFile: {
            objectId: +options.objectId,
            mnemonic: options.mnemonic,
            objectType: options.objectType,
          },
        },
      ],
    };
    return this.http
      .post<void>(this.getTerabyteApiUrl('/copy'), body, this.getServerRequestOptions())
      .pipe(tap(() => this.health.measureEnd('copyFileApi', RequestStatus.Succeed, options)));
  }

  createFormData(options: TerraUploadFileOptions, file: File | Blob): FormData {
    const formData = new FormData();
    if (file instanceof File) {
      formData.append('file', file, file.name);
    } else {
      formData.append('file', file);
    }
    Object.keys(options).forEach((k) => {
      formData.append(k, options[k]);
    });
    return formData;
  }

  /**
   * Запрос на удаление файла
   * @param options - данные о файле
   */
  deleteFile(options: TerraFileOptions): Observable<UploadedFile> {
    this.health.measureStart('deleteFileApi');
    const url = `/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`;
    return this.http
      .delete<UploadedFile>(this.getTerabyteApiUrl(url), this.getServerRequestOptions())
      .pipe(tap(() => this.health.measureEnd('deleteFileApi', RequestStatus.Succeed, options)));
  }

  getDownloadApiPath(options: TerraFileOptions): string {
    return this.getTerabyteApiUrl(
      `/${options.objectId}/${options.objectType}/download?mnemonic=${options.mnemonic}`,
    );
  }

  /**
   * Запрос на загрузку уже существующего
   * @param options - данные о файле
   */
  downloadFile(options: TerraFileOptions): Observable<Blob> {
    this.health.measureStart('downloadFileApi');
    return this.http
      .get<Blob>(
        this.getDownloadApiPath(options),
        this.getServerRequestOptions({
          responseType: 'blob',
        }),
      )
      .pipe(tap(() => this.health.measureEnd('downloadFileApi', RequestStatus.Succeed, options)));
  }

  /**
   * Открыть файл в новой вкладке
   * @param options - данные о файле
   * @param mimeType - тип файла
   */
  openFileNewTabByMimeType(options: TerraFileOptions, mimeType: string): void {
    this.downloadFile(options).subscribe((res) => {
      window.open(URL.createObjectURL(new Blob([res], { type: mimeType })), '_blank');
    });
  }

  /**
   * Скачивание по ссылке файла в браузер
   * @param data - Blob данные для скачивания
   * @param file - файл для загрузки
   */
  pushFileToBrowserForDownload(data: Blob, file: UploadedFile): void {
    let resultBlob = data;

    if (file.mimeType) {
      resultBlob = resultBlob.slice(0, resultBlob.size, file.mimeType);
    }

    FileSaver.saveAs(resultBlob, file.fileName);
  }

  /**
   * Возвращает путь API адреса для обращений к сервису TERABYTE
   *
   * @param relativePath - относительный путь от API для запросов
   */
  private getTerabyteApiUrl = (relativePath): string => this.config.fileUploadApiUrl + relativePath;

  /**
   * Возвращает путь API адреса для обращений к сервису Gallery
   *
   * @param relativePath - относительный путь от API для запросов
   */
  private getGalleryApiUrl = (relativePath): string =>
    `${this.config.galleryApiUrl + relativePath}/files`;

  /**
   * Возращает опции запроса
   * @private
   */
  private getServerRequestOptions(additionalOptions: object = {}): object {
    let options = {
      withCredentials: true,
    };
    options = { ...additionalOptions, ...options };
    return options;
  }
}
