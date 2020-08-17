import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ITerraFileOptions, ITerraUploadFileOptions, TerabyteConfig} from '../config/terabyte.config';
import { Observable } from 'rxjs';



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
   * @param base64ImageString - base64 закодированная строка
   */
  static base64toBlob(base64ImageString): Promise<Blob> {
    return fetch(base64ImageString).then(res => res.blob());
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
  getListByObjectId(objectId: string): Observable<any>  {
    return this.http.get(this.getTerabyteApiUrl('/${objectId}'));
  }

  /**
   * Возвращает информацию по файлу
   * @param options - параметры для получения файла
   */
  getFileInfo(options: ITerraFileOptions): Observable<any>  {
    return this.http.get(this.getTerabyteApiUrl(`/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`));
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
    // eslint-disable-next-line max-len
    //formData.append('token', TERABYTE_TEST_TOKEN);
    //formData.append('userId', '1000299353');

    // const headers = new HttpHeaders({
    //   Authorization: 'Bearer ' + TERABYTE_TEST_TOKEN
    // });
    //headers.append('Authorization', `bearer ${TERABYTE_TEST_TOKEN}`);
    console.log('formData', formData.get('file'));
    return this.http.post(this.getTerabyteApiUrl('/upload'), formData, {
      withCredentials: true
    });
  }

  /**
   * Запрос на удаление файла
   */
  deleteFile(options: ITerraFileOptions): Observable<any> {
    return this.http.delete(this.getTerabyteApiUrl(`/${options.objectId}/${options.objectType}?mnemonic=${options.mnemonic}`));
  }


}
