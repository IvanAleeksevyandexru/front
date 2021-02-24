import {
  TerabyteListItem,
  TerraFileOptions,
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../../services/terra-byte-api/terra-byte-api.types';
import { BehaviorSubject } from 'rxjs';
import { v4 } from 'uuid';

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
export enum FileItemStatusText {
  error = 'ошибка',
  uploading = 'загружается...',
  uploaded = 'загружено',
  preparation = 'обработка...',
  downloading = 'скачивается...',
  delition = 'удаляется...',
}

export class FileItemStore {
  files = new BehaviorSubject<FileItem[]>([]);

  add(file: FileItem): FileItemStore {
    const files = [...this.files.getValue(), file];
    this.files.next(files);
    return this;
  }
  update(file: FileItem): void {
    const files = [...this.files.getValue()];
    const index = files.findIndex((item) => item.id === file.id);
    files[index] = Object.assign(Object.create(Object.getPrototypeOf(file)), file);
    this.files.next(files);
  }
  remove(file: FileItem): void {
    const files = [...this.files.getValue()];
    this.files.next(files.filter((item) => item.id !== file.id));
  }

  removeWithErrorStatus(ignoreTypes: ErrorActions[] = []): void {
    const files = [...this.files.getValue()];
    this.files.next(
      files.filter(
        (item) =>
          (item.status === FileItemStatus.error && ignoreTypes.includes(item?.error?.type)) ||
          item.status !== FileItemStatus.error,
      ),
    );
  }

  changeStatus(file: FileItem, status: FileItemStatus): void {
    file.setStatus(status);
    this.update(file);
  }
  errorTo(errorType: ErrorActions, status: FileItemStatus): void {
    const files = [...this.files.getValue()];
    files.forEach((item) =>
      item?.error?.type === errorType ? this.update(item.setStatus(status).clearError()) : null,
    );
  }
}

export class FileItem {
  id = v4();
  error: FileItemError;
  isImage: boolean;
  limited = false;
  isRawMock = false;
  attached = false;
  constructor(
    public status: FileItemStatus,
    public fileUploadApiUrl: string,
    public raw?: File,
    public item?: UploadedFile,
  ) {
    if (item) {
      this.item.uploaded = true;
    }
    if (!raw && item) {
      this.raw = {
        size: item.fileSize,
        name: item.fileName,
        type: item.mimeType,
      } as File;
      this.isRawMock = true;
    }
    this.isImage = /^.*\.(jpe?g|gif|png|bmp)$/i.test(this.raw.name);
  }

  setAttached(attached: boolean): FileItem {
    this.attached = attached;
    return this;
  }

  urlToFile(): string {
    if (!this.isRawMock) {
      return window.URL.createObjectURL(this.raw);
    }

    return this.item
      ? `${this.fileUploadApiUrl}/${this.item?.objectId}/${this.item?.objectTypeId}/download?mnemonic=${this.item?.mnemonic}`
      : '';
  }

  setLimited(limit: boolean): FileItem {
    this.limited = limit;
    return this;
  }

  setError(error: FileItemError): FileItem {
    this.error = error;
    this.setStatus(FileItemStatus.error);
    return this;
  }
  clearError(): FileItem {
    this.error = null;
    return this;
  }
  setStatus(status: FileItemStatus): FileItem {
    this.status = status;
    return this;
  }
  setRaw(raw: File): FileItem {
    this.raw = raw;
    this.isRawMock = false;
    return this;
  }
  setItem(item: UploadedFile): FileItem {
    this.item = item;
    this.item.uploaded = true;
    return this;
  }

  createUploadedParams(): TerraFileOptions {
    return {
      objectId: this.item.objectId,
      objectType: this.item.objectTypeId,
      mnemonic: this.item.mnemonic,
      mimeType: this.item.mimeType,
    } as TerraFileOptions;
  }

  createUploadOptions(
    objectId: string,
    objectType: number,
    mnemonic: string,
  ): TerraUploadFileOptions {
    return {
      name: this.raw.name,
      mimeType: this.raw.type,
      objectId: objectId,
      objectType: objectType,
      mnemonic: mnemonic,
    } as TerraUploadFileOptions;
  }

  isTypeValid(acceptTypes?: string): boolean {
    if (!acceptTypes) {
      return true;
    }
    const extension = `.${this.raw.name.split('.').pop()}`.toLowerCase();
    const validTypes = acceptTypes.toLowerCase().split(',');

    return validTypes.some((validType) => validType === extension);
  }
}

export interface FileItemError {
  type: ErrorActions;
  text: string;
  description?: string;
}

export enum OperationType {
  upload = 'upload',
  delete = 'delete',
  download = 'download',
  prepare = 'prepare',
}
export interface CancelAction {
  type: OperationType;
  item: FileItem;
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
