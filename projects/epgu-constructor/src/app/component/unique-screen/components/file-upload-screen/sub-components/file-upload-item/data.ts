import {
  TerabyteListItem,
  TerraFileOptions,
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../../services/terra-byte-api/terra-byte-api.types';
import { BehaviorSubject } from 'rxjs';

export enum ErrorActions {
  clear = 'clear',
  addMaxSize = 'maxSize',
  addMaxAmount = 'maxAmount',
  addMaxTotalAmount = 'maxTotalAmount',
  addMaxTotalSize = 'maxTotalSize',
  addInvalidType = 'invalidType',
  addInvalidFile = 'invalidFile',
  addDownloadErr = 'addDownloadErr',
  addUploadErr = 'addUploadErr',
  addDeletionErr = 'addDeletionErr',
}

export enum FileItemStatus {
  error = 'error',
  uploading = 'uploading',
  uploaded = 'uploaded',
  preparation = 'preparation',
  downloading = 'downloading',
  delition = 'delition',
}

export interface FileItem {
  raw?: File;
  id: string;
  item: UploadedFile;
  status: FileItemStatus;
  errors: FileItemError[];
}
export interface FileItemError {
  type: string;
  text: string;
}

export enum OperationType {
  upload = 'upload',
  delete = 'delete',
  download = 'download',
}

export interface Operation {
  type: OperationType;
  cancel: BehaviorSubject<boolean>; // Если сюда отправить true операция будет отменена
  item: FileItem;
}

/**
 * Класс подгруженного файла
 */
export class TerraUploadedFile implements UploadedFile {
  fileExt?: string;
  fileName = '';
  fileSize = 0;
  fileUid?: number;
  hasSign?: boolean;
  metaId?: number;
  mimeType?: string;
  mnemonic = '';
  nodeId?: string;
  objectId = '';
  objectTypeId = 0;
  realPath?: string;
  uploaded = false;
  userId?: number;
  hasError = false;
  created?: string;
  updated?: string;
  deleted?: boolean;

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
      mimeType: this.mimeType,
    } as TerraUploadFileOptions;
  }

  /**
   * Возвращает объект с данными и параметрами для загрузки на сервер файла
   */
  setParamsForUploadedFile(terraFile: TerabyteListItem, uploaded: boolean): void {
    Object.keys(terraFile).forEach((key: string) => {
      this[key] = terraFile[key];
    });
    this.uploaded = uploaded;
  }

  /**
   * Возвращает объект с данными с параметрами получения сведений о файле
   */
  getParamsForFileOptions(): TerraFileOptions {
    return {
      objectId: this.objectId,
      objectType: this.objectTypeId,
      mnemonic: this.mnemonic,
      mimeType: this.mimeType,
    } as TerraFileOptions;
  }

  /**
   * Возвращает размер в килобайтах или мегабайтах
   */
  getFileSize(): string {
    const sizeInMB = getSizeInMB(this.fileSize);
    return `${(sizeInMB < 0.1 ? 0.1 : sizeInMB).toFixed(1)} МБ`;
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
export const getSizeInKB = (bytes): number =>
  Math.round((bytes / BYTES_IN_KB + Number.EPSILON) * 100) / 100;

/**
 * Возвращает размер в мегабайтах из байт
 * @param bytes - байты для перевода
 */
export const getSizeInMB = (bytes): number =>
  Math.round((bytes / BYTES_IN_KB / BYTES_IN_KB + Number.EPSILON) * 100) / 100;
