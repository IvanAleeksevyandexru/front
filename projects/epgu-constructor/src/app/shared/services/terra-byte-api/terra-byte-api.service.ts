import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TerraFileOptions, TerraUploadFileOptions } from './terra-byte-api.types';
import { Observable } from 'rxjs';
import { TerraUploadedFile } from '../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';
import { ConfigService } from '../../../core/config/config.service';

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
  private getTerabyteApiUrl = (relativePath): string =>
      this.config.fileUploadApiUrl + relativePath;

  /**
   * Возращает опции запроса
   * @private
   */
  private getServerRequestOptions(additionalOptions: object = {}): object {
    let options = {
      withCredentials: true
    };
    options = { ...additionalOptions, ...options };
    return options;
  }

  /**
   * Возвращает список файлов, для определённого объекта
   * @param objectId - идентификатор объекта
   */
  getListByObjectId(objectId: string): Observable<any>  {
    return this.http.get(this.getTerabyteApiUrl(`/${objectId}`), this.getServerRequestOptions());
  }

  /**
   * Возвращает информацию по файлу
   * @param options - параметры для получения файла
   */
  getFileInfo(options: TerraFileOptions): Observable<any>  {
    // eslint-disable-next-line max-len
    return this.http.get(this.getTerabyteApiUrl(`/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`), this.getServerRequestOptions());
  }

  /**
   * Загружает файл на сервер
   * @param options - опции для отправки файла
   * @param file - данные файла
   */
  uploadFile(options: TerraUploadFileOptions, file: File | Blob): Observable<any> {
    const formData = new FormData();
    if (file instanceof File){
      formData.append('file', file, file.name);
    } else {
      formData.append('file', file);
    }
    Object.keys(options).forEach(k => {
      formData.append(k, options[k]);
    });

    return this.http.post(this.getTerabyteApiUrl('/upload'), formData, this.getServerRequestOptions());
  }

  /**
   * Запрос на удаление файла
   * @param options - данные о файле
   */
  deleteFile(options: TerraFileOptions): Observable<any> {
    const url = `/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`;
    // eslint-disable-next-line max-len
    return this.http.delete(this.getTerabyteApiUrl(url), this.getServerRequestOptions());
  }


  /**
   * Запрос на загрузку уже существующего
   * @param options - данные о файле
   */
  downloadFile(options: TerraFileOptions): Observable<any> {
    // eslint-disable-next-line max-len
    return this.http.get(this.getTerabyteApiUrl(`/${options.objectId}/${options.objectType}/download?mnemonic=${options.mnemonic}`), this.getServerRequestOptions({
      responseType: 'blob'
    }));
  }

  /**
   * Отдача пользователю файла прямо в браузер
   * @param data - Blob данные для скачивания
   * @param file - файл для загрузки
   */
  pushFileToBrowserForDownload(data: Blob, file: TerraUploadedFile) {
    // eslint-disable-next-line max-len
    const isMacOSWebView = /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent);
    if ('download' in HTMLAnchorElement.prototype && !isMacOSWebView){
      this.downloadLinkForAndroid(data, file);
    }else{
      this.downloadLinkForIOS(data, file, isMacOSWebView);
    }
  }

  /**
   * Скачивание ссылки для IOS
   * @param data - Blob данные для скачивания
   * @param file - файл для загрузки
   * @param isMacOSWebView - Если это Маковский Webview
   */
  private downloadLinkForIOS(data: Blob, file: TerraUploadedFile, isMacOSWebView) {
    const force = data.type === 'application/octet-stream';
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

    if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== 'undefined') {
      // Safari doesn't allow downloading of blob URLs
      var reader = new FileReader();

      reader.onloadend = function () {
        let url = reader.result;
        url = isChromeIOS ? url : url.toString().replace(/^data:[^;]*;/, 'data:attachment/file;');
        // @ts-ignore
        location = url;
      };

      reader.readAsDataURL(data);
    } else {
      const url = URL.createObjectURL(data);
      location.href = url;

      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 4E4); // 40s
    }
  }

  /**
   * Скачивание ссылки для андроид и других устройств
   * @param data - Blob данные для скачивания
   * @param file - файл для загрузки
   * @private
   */
  private downloadLinkForAndroid(data: Blob, file: TerraUploadedFile) {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.rel = 'noopener'; // tabnabbing
    a.download = file.fileName;
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 4E4);
    a.click();
    a.remove();
  }
}
