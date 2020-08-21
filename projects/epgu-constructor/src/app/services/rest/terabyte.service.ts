import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ITerraFileOptions, ITerraUploadFileOptions } from '../../../interfaces/terabyte.interface';
import { Observable } from 'rxjs';
import { UploadedFile } from '../../modules/unique/components/file-upload-screen/sub-components/file-upload-item/data';
import { ConstructorConfigService } from '../config/constructor-config.service';

/**
 * Сервис для обмена файлами с сервисом терабайт
 */
@Injectable({
  providedIn: 'root'
})
export class TerabyteService {
  isLocalHost = false;
  testToken: string;
  apiUrl: string;
  apiLocalhostUrl: string;

  constructor(
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService,
  ) {
    this.isLocalHost = location.hostname === 'localhost';
    this.testToken = constructorConfigService.config.apiUrl;
    this.apiUrl = constructorConfigService.config.fileUploadApiUrl;
    this.apiLocalhostUrl = constructorConfigService.config.fileUploadLocalhostApiUrl;
  }

  /**
   * Переводит base64 картинку в Blob
   * @param base64Data - base64 закодированная строка
   * @param contentType - тип контента
   */
  static base64toBlob(base64Data: string, contentType: string): Blob {
    const parts = base64Data.split(';base64,');
    const imageType = parts[0].split(':')[1];
    const decodedData = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(decodedData.length);

    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: imageType });
  }

  /**
   * Возвращает объект заголовков, которые нужны для запуска на тестовом домене
   */
  private getTestHeaders(): HttpHeaders {
    return new HttpHeaders({
      Cookie: 'acc_t=' + this.testToken + '; Path=/; Domain=.pgu-dev-fed.test.gosuslugi.ru; Expires=Mon, 30 Aug 2021 09:32:01 GMT;',
    });
  }

  /**
   * Возвращает путь API адреса для обращений к сервису TERABYTE
   *
   * @param relativePath - относительный путь от API для запросов
   */
  private getTerabyteApiUrl = (relativePath): string =>
      (this.isLocalHost ? this.apiLocalhostUrl : this.apiUrl) + relativePath;

  /**
   * Возращает опции запроса
   * @private
   */
  private getServerRequestOptions(additionalOptions: object = {}): object {
    let options = {
      withCredentials: true
    }
    if (this.isLocalHost){
      options['headers'] = this.getTestHeaders();
    }
    options = {...additionalOptions, ...options}
    return options;
  }

  /**
   * Возвращает список файлов, для определённого объекта
   * @param objectId - идентификатор объекта
   */
  getListByObjectId(objectId: number): Observable<any>  {
    return this.http.get(this.getTerabyteApiUrl(`/${objectId}`), this.getServerRequestOptions());
  }

  /**
   * Возвращает информацию по файлу
   * @param options - параметры для получения файла
   */
  getFileInfo(options: ITerraFileOptions): Observable<any>  {
    // eslint-disable-next-line max-len
    return this.http.get(this.getTerabyteApiUrl(`/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`), this.getServerRequestOptions());
  }

  /**
   * Загружает файл на сервер
   * @param options - опции для отправки файла
   * @param file - данные файла
   */
  uploadFile(options: ITerraUploadFileOptions, file: File | Blob): Observable<any> {
    const formData = new FormData();
    if (file instanceof File){
      formData.append('file', file, file.name);
    }else{
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
  deleteFile(options: ITerraFileOptions): Observable<any> {
    // eslint-disable-next-line max-len
    return this.http.delete(this.getTerabyteApiUrl(`/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`), this.getServerRequestOptions());
  }


  /**
   * Запрос на загрузку уже существующего
   * @param options - данные о файле
   */
  downloadFile(options: ITerraFileOptions): Observable<any> {
    // eslint-disable-next-line max-len
    return this.http.get(this.getTerabyteApiUrl(`/${options.objectId}/${options.objectType}/download?mnemonic=${options.mnemonic}`), this.getServerRequestOptions({
      responseType: 'blob'
    }));
  }

  /**
   * Отдача пользователю файла прямо в браузер
   * @private
   */
  pushFileToBrowserForDownload(data: Blob, file: UploadedFile) {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = file.fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
