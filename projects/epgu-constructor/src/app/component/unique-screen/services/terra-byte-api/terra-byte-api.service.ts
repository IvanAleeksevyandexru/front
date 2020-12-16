import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  TerabyteListItem,
  TerraFileOptions,
  TerraUploadFileOptions,
  UploadedFile,
} from './terra-byte-api.types';
import { Observable } from 'rxjs';
import { TerraUploadedFile } from '../../components/file-upload-screen/sub-components/file-upload-item/data';
import { ConfigService } from '../../../../core/config/config.service';
import * as FileSaver from 'file-saver';

/**
 * Сервис для обмена файлами с сервисом терабайт
 */
@Injectable()
export class TerraByteApiService {
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

  /**
   * Возвращает список файлов, для определённого объекта
   * @param objectId - идентификатор объекта
   */
  getListByObjectId(objectId: string): Observable<TerabyteListItem[]> {
    return this.http.get<TerabyteListItem[]>(
      this.getTerabyteApiUrl(`/${objectId}`),
      this.getServerRequestOptions(),
    );
  }

  /**
   * Возвращает информацию по файлу
   * @param options - параметры для получения файла
   */
  getFileInfo(options: TerraFileOptions): Observable<TerabyteListItem> {
    // eslint-disable-next-line max-len
    return this.http.get<TerabyteListItem>(
      this.getTerabyteApiUrl(
        `/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`,
      ),
      this.getServerRequestOptions(),
    );
  }

  /**
   * Загружает файл на сервер
   * @param options - опции для отправки файла
   * @param file - данные файла
   */
  uploadFile(options: TerraUploadFileOptions, file: File | Blob): Observable<void> {
    const formData = new FormData();
    if (file instanceof File) {
      formData.append('file', file, file.name);
    } else {
      formData.append('file', file);
    }
    Object.keys(options).forEach((k) => {
      formData.append(k, options[k]);
    });

    return this.http.post<void>(
      this.getTerabyteApiUrl('/upload'),
      formData,
      this.getServerRequestOptions(),
    );
  }

  /**
   * Запрос на удаление файла
   * @param options - данные о файле
   */
  deleteFile(options: TerraFileOptions): Observable<TerraUploadedFile> {
    const url = `/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`;
    // eslint-disable-next-line max-len
    return this.http.delete<TerraUploadedFile>(
      this.getTerabyteApiUrl(url),
      this.getServerRequestOptions(),
    );
  }

  /**
   * Запрос на загрузку уже существующего
   * @param options - данные о файле
   */
  downloadFile(options: TerraFileOptions): Observable<Blob> {
    // eslint-disable-next-line max-len
    return this.http.get<Blob>(
      this.getTerabyteApiUrl(
        `/${options.objectId}/${options.objectType}/download?mnemonic=${options.mnemonic}`,
      ),
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
  pushFileToBrowserForDownload(data: Blob, file: TerraUploadedFile): void {
    let resultBlob = data;

    if (file.mimeType) {
      resultBlob = resultBlob.slice(0, resultBlob.size, file.mimeType);
    }

    FileSaver.saveAs(resultBlob, file.fileName);
  }
}
