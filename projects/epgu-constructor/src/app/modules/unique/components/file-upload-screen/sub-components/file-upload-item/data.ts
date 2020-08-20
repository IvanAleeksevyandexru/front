import {ITerraFileOptions, ITerraUploadFileOptions} from '../../../../../../services/config/terabyte.config';

/**
 * Интерфейс для аттрибутов файла на загрузку из JSON
 */
export interface IFileUploadAttributes{
  uploads: IFileUploadItem[],
  idAttrs?: string[];
  ref?: string;
  maxSize?: number;
  maxFileCount?: number;
}


/**
 * Интерфейс для связанных файлов на загрузки из JSON
 */
export interface IRelatedUploads extends IFileUploadAttributes{
  ref: string;
  idAttrs: string[];
}

/**
 * Интерфейс для файла на загругку из JSON
 */
export interface IFileUploadItem{
  uploadId: string;
  label: string;
  fileType: string[];
  maxFileCount?: number;
  maxSize?: number;
  relatedUploads?: IRelatedUploads
}

/**
 * Интерфейс для класса подгруженного файла
 */
export interface IUploadedFile{
  fileName: string;
  objectId: number;
  objectTypeId: number;
  mnemonic: string;
  uploaded: boolean;
  fileSize: number;
  hasError: boolean;

  alternativeMimeTypes?: string[]
  created?: string;
  deleted?: boolean;
  fileExt?: string;
  fileUid?: number;
  hasSign?: boolean;
  metaId?: number;
  nodeId?: string;
  realPath?: string;
  relativePath?: string;
  updated?: string;
  userId?: number;
}

/***
 * Интерфейс для файла из списка файлов в хранилище террабайт
 */
export interface TerrabyteListItem{
  alternativeMimeTypes: string[];
  created: string;
  deleted: boolean;
  fileExt: string;
  fileName: string;
  fileSize: number;
  fileUid: number;
  hasSign: boolean;
  metaId: number;
  mnemonic: string;
  nodeId: string;
  objectId: number;
  objectTypeId: number;
  realPath: string;
  relativePath: string;
  updated: string;
  userId: number;
}

/**
 * Класс подгруженного файла
 */
export class UploadedFile implements IUploadedFile{
  fileName = '';
  objectId = 0;
  objectTypeId = 0;
  mnemonic = '';
  fileSize = 0;
  uploaded = false;
  hasError = false;

  constructor(props: object = {}) {
    Object.keys(props).forEach((key) => {
      this[key] = props[key];
    });
  }

  /**
   * Возвращает объект с данными и параметрами для загрузки на сервер файла
   */
  getParamsForUploadFileOptions(): ITerraUploadFileOptions {
    return {
      name: this.fileName,
      objectId: this.objectId,
      objectType: this.objectTypeId,
      mnemonic: this.mnemonic,
    } as ITerraUploadFileOptions
  }

  /**
   * Возвращает объект с данными с параметрами получения сведений о файле
   */
  getParamsForFileOptions(): ITerraFileOptions {
    return {
      objectId: this.objectId,
      objectType: this.objectTypeId,
      mnemonic: this.mnemonic,
    } as ITerraFileOptions
  }

  /**
   * Возвращает размер в килобайтах или мегабайтах
   */
  getFileSize(): string {
    const sizeInMB = getSizeInMB(this.fileSize);
    return sizeInMB > 0 ? `${sizeInMB} МБ` : `${getSizeInKB(this.fileSize)} КБ`;
  }
}

/**
 * Тип загружаемого документа
 */
export const uploadObjectType = 2;

/**
 * Количество байт в килобайте
 */
export const BYTES_IN_KB = 1024;

// eslint-disable-next-line max-len
export const TERABYTE_TEST_TOKEN = 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTc4MzE4ODksInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl90cm0_b2lkPTEwMDAyOTkzNTMmbW9kZT13IGh0dHA6XC9cL2VzaWEuZ29zdXNsdWdpLnJ1XC91c3JfaW5mP29pZD0xMDAwMjk5MzUzJm1vZGU9dyBodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvdXNyX3NlYz9tb2RlPXcmb2lkPTEwMDAyOTkzNTMiLCJpc3MiOiJodHRwOlwvXC9lc2lhLmdvc3VzbHVnaS5ydVwvIiwidXJuOmVzaWE6c2lkIjoiNDM0YjQxMjRlNGIxNjg2M2ZjODVkYTI3NzhmY2ZjZmY2NmM1YzRmZTlmYTg0MDEzMjZlNWViMWNmNmYwOTUyOSIsInVybjplc2lhOnNial9pZCI6MTAwMDI5OTM1MywiZXhwIjoxNTk3OTE4Mjg5LCJpYXQiOjE1OTc4MzE4ODksImNsaWVudF9pZCI6IlBHVSJ9.HBSIKOVZmABnhUDz3UPQaI441PGjWc-RTabYgksej43sne3LRH0KEQ3e0STPFTh2lZQSmYhSZK1pl3jL10c9htdMVxtd6eZMEfkC06_I_sJk-t9QWiCI5D6D7NQy4TE2rOskM1s6sHR1bSQcSiBoOmMN-VLECn9ax_jHzAFn-ysjt4at2zVapK0FwC9ZcypPYQXZSmrEdoiF6M74obKes8M7ZGbLrt8NwKRKhGUTrEhu4Hz3wxVTAqaPWT8YIfPBIw4IaQEGFTZ9YbcgEzcUXiuFDKMJhhr1x3I7m_pxCjiRFkIfTQ9CvZLi-Iim1kfyVnBhxfbIP7Eya-lttlQKLQ';

/**
 * Возвращает размер в килобайтах из байт
 * @param bytes - байты для перевода
 */
export const getSizeInKB = (bytes) => Math.round(((bytes / BYTES_IN_KB) + Number.EPSILON) * 100) / 100;

/**
 * Возвращает размер в мегабайтах из байт
 * @param bytes - байты для перевода
 */
export const getSizeInMB = (bytes) => Math.round(((bytes / BYTES_IN_KB / BYTES_IN_KB) + Number.EPSILON) * 100) / 100;
