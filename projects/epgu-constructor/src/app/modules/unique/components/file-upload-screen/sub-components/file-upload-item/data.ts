import {ITerraFileOptions, ITerraUploadFileOptions} from '../../../../../../services/config/terabyte.config';

/**
 * Интерфейс для экспорта одного значения для компонента загрузки
 */
export interface IFileResponseToBackendUploadsItem{
  uploadId: string;
  value?: IUploadedFile[]
  relatedUploads?: {
    uploads: IFileResponseToBackendUploadsItem[]
  }
}
/**
 * Интерфейс для экспорта одного значения для компонента загрузки для связанных компонентов
 */
export interface IFileResponseToBackendWithRelatedUploads{
  uploadId: string;
  uploads?: IFileResponseToBackendUploadsItem[]
}

/**
 * Интерфейс для аттрибутов файла на загрузку из JSON
 */
export interface IFileUploadAttributes{
  uploads: IFileUploadItem[],
  uploadId?: string;
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
