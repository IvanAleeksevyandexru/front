import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, range, from, combineLatest, of } from 'rxjs';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import * as FileSaver from 'file-saver';
import { concatMap, map, mergeMap, reduce } from 'rxjs/operators';
import {
  Chunk,
  ChunkPacket,
  TerraFileOptions,
  TerraUploadFileOptions,
  UploadedFile,
} from './terra-byte-api.types';
import { BYTES_IN_KB } from '../../../shared/components/file-upload/data';

/**
 * Сервис для обмена файлами с сервисом терабайт
 */
@Injectable()
export class TerraByteApiService {
  chunkSize = 6 * BYTES_IN_KB * BYTES_IN_KB; //кол-во в мб
  chunkPacketMaxSize = 1;
  constructor(private http: HttpClient, private config: ConfigService) {}

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
   * Возвращает информацию по файлу
   * @param options - параметры для получения файла
   */
  getFileInfo(options: TerraFileOptions): Observable<UploadedFile> {
    // eslint-disable-next-line max-len
    return this.http.get<UploadedFile>(
      this.getTerabyteApiUrl(
        `/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`,
      ),
      this.getServerRequestOptions(),
    );
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
      acc.push([]); //запрещаем добавлять в 1 часть
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
    return file.size <= this.chunkSize
      ? this.uploadForm(this.createFormData(options, file))
      : this.uploadByChunkFile(options, file);
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
    const url = `/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`;
    // eslint-disable-next-line max-len
    return this.http.delete<UploadedFile>(
      this.getTerabyteApiUrl(url),
      this.getServerRequestOptions(),
    );
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
    // eslint-disable-next-line max-len
    return this.http.get<Blob>(
      this.getDownloadApiPath(options),
      this.getServerRequestOptions({
        responseType: 'blob',
      }),
    );
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
