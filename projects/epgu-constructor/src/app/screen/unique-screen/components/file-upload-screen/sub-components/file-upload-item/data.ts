import {
  TerraFileOptions,
  TerraUploadFileOptions,
  UploadedFile
} from '../../services/terra-byte-api/terra-byte-api.types';

/**
 * Класс подгруженного файла
 */
export class TerraUploadedFile implements UploadedFile{
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
  getParamsForUploadFileOptions(): TerraUploadFileOptions {
    return {
      name: this.fileName,
      objectId: this.objectId,
      objectType: this.objectTypeId,
      mnemonic: this.mnemonic,
    } as TerraUploadFileOptions;
  }

  /**
   * Возвращает объект с данными с параметрами получения сведений о файле
   */
  getParamsForFileOptions(): TerraFileOptions {
    return {
      objectId: this.objectId,
      objectType: this.objectTypeId,
      mnemonic: this.mnemonic,
    } as TerraFileOptions;
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
export const UPLOAD_OBJECT_TYPE = 2;

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
