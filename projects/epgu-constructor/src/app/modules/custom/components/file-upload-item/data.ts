/**
 * Интерфейс для аттрибутов файла на загрузку из JSON
 */
export interface IFileUploadAttributes{
  uploads: IFileUploadItem[],
  maxSize?: number;
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
  name: string;
  objectId: string;
  objectType: string;
  mnemonic: string;
}

/**
 * Класс подгруженного файла
 */
export class UploadedFile implements IUploadedFile{
  name = '';
  objectId = '';
  objectType = '';
  mnemonic = '';
  uploaded = false;
}

export const uploadObjectType = 3;

export const BYTES_IN_KB = 1024;

/**
 * Возвращает размер в килобайтах из байт
 * @param bytes - байты для перевода
 */
export const getSizeInKB = (bytes) => bytes / BYTES_IN_KB;

/**
 * Возвращает размер в мегабайтах из байт
 * @param bytes - байты для перевода
 */
export const getSizeInMB = (bytes) => bytes / BYTES_IN_KB / BYTES_IN_KB;
