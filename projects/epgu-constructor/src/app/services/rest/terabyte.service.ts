import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ITerraFileOptions, ITerraUploadFileOptions, TerabyteConfig} from '../config/terabyte.config';
import { Observable } from 'rxjs';
import {TERABYTE_TEST_TOKEN} from '../../modules/custom/components/file-upload-item/data';



/**
 * Сервис для обмена файлами с сервисом терабайт
 */
@Injectable({
  providedIn: 'root'
})
export class TerabyteService {
  constructor(
    private http: HttpClient
  ) {}

  /**
   * Переводит base64 картинку в Blob
   * @param base64Data - base64 закодированная строка
   * @param contentType - тип контента
   */
  static base64toBlob(base64Data: string, contentType: string): Blob {
    const type = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);

    let byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      let bytes = new Array(end - begin);

      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }

      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type });
  }

  /**
   * Возвращает путь API адреса для обращений к сервису TERRABYTE
   *
   * @param relativePath - относительный путь от API для запросов
   */
  getTerabyteApiUrl = (relativePath) =>
      (location.hostname === 'localhost' ? TerabyteConfig.LOCALHOST_API_URL : TerabyteConfig.API_URL) + relativePath;

  /**
   * Возвращает список файлов, для определённого объекта
   * @param objectId - идентификатор объекта
   */
  getListByObjectId(objectId: number): Observable<any>  {
    //return this.http.get(this.getTerabyteApiUrl(`/${objectId}`));
    return this.http.get(`https://pgu-dev-fed.test.gosuslugi.ru/api/storage/v1/files/${objectId}`, {
      withCredentials: true
    });
  }

  /**
   * Возвращает информацию по файлу
   * @param options - параметры для получения файла
   */
  getFileInfo(options: ITerraFileOptions): Observable<any>  {
    // eslint-disable-next-line max-len
    return this.http.get(`https://pgu-dev-fed.test.gosuslugi.ru/api/storage/v1/files/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`);
    //return this.http.get(this.getTerabyteApiUrl(`/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`));
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
    // formData.append('token', TERABYTE_TEST_TOKEN);
    // formData.append('userId', '1000299353');

    const headers = new HttpHeaders({
      Cookie: 'acc_t=' + TERABYTE_TEST_TOKEN + '; Path=/; Domain=.pgu-dev-fed.test.gosuslugi.ru; Expires=Mon, 30 Aug 2021 09:32:01 GMT;',
      Authorization:`bearer ${TERABYTE_TEST_TOKEN}`
    });
    //headers.append('Authorization', `bearer ${TERABYTE_TEST_TOKEN}`);
    console.log('formData', formData.get('file'));
    // return this.http.post(this.getTerabyteApiUrl(''), formData, {
    //   withCredentials: true
    // });
    return this.http
      .post('https://pgu-dev-fed.test.gosuslugi.ru/api/storage/v1/files/upload', formData, {
      headers,
      withCredentials: true,
    });
  }

  /**
   * Запрос на удаление файла
   * @param options - данные о файле
   */
  deleteFile(options: ITerraFileOptions): Observable<any> {
    //return this.http.delete(this.getTerabyteApiUrl(`/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`));
    // eslint-disable-next-line max-len
    return this.http.delete(`https://pgu-dev-fed.test.gosuslugi.ru/api/storage/v1/files/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`);
  }


  /**
   * Запрос на загрузку уже существующего
   * @param options - данные о файле
   */
  downloadFile(options: ITerraFileOptions): Observable<any> {
    //return this.http.delete(this.getTerabyteApiUrl(`/${options.objectId}/${options.objectType}/download?mnemonic=${options.mnemonic}`));
    // eslint-disable-next-line max-len
    return this.http.get(`https://pgu-dev-fed.test.gosuslugi.ru/api/storage/v1/files/${options.objectId}/${options.objectType}/download?mnemonic=${options.mnemonic}`);
  }


}
