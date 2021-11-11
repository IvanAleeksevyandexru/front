import {
  FileUploadItem,
  TerraFileOptions,
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../core/services/terra-byte-api/terra-byte-api.types';
import { BehaviorSubject } from 'rxjs';
import { v4 } from 'uuid';
import { Observable } from 'rxjs/internal/Observable';
import { Clarifications } from '@epgu/epgu-constructor-types';

export enum ErrorActions {
  clear = 'clear',
  addMaxSize = 'maxSize',
  addMinSize = 'minSize',
  addMaxAmount = 'maxAmount',
  addMaxTotalAmount = 'maxTotalAmount',
  addMaxTotalSize = 'maxTotalSize',
  addInvalidType = 'invalidType',
  addInvalidFile = 'invalidFile',
  addInvalidFileName = 'addInvalidFileName',
  addDownloadErr = 'addDownloadErr',
  addUploadErr = 'addUploadErr',
  addDeletionErr = 'addDeletionErr',
  serverError = 'serverError',
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

export interface UploadContext {
  files: UploadedFile[];
  galleryFiles: UploadedFile[];
  objectId: string;
  prefixForMnemonic: string;
  data: FileUploadItem;
  clarifications: Clarifications;
}

export const mimeTypeByExtension = {
  sig: 'application/signature',
  rar: 'application/x-rar-compressed',
};

export const extToLowerCase: (name: string) => string = (name: string) => {
  if (!name) {
    return name;
  }
  const nameWithLowerExt = name.split('.');
  if (nameWithLowerExt.length > 0) {
    nameWithLowerExt[nameWithLowerExt.length - 1] = nameWithLowerExt[
      nameWithLowerExt.length - 1
    ].toLowerCase();
  }
  return nameWithLowerExt.join('.');
};

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
      const type = this.getMimeType();
      this.raw = {
        size: item.fileSize,
        name: extToLowerCase(item.fileName),
        type,
      } as File;
      this.isRawMock = true;
      this.item.objectTypeId = this.item.objectType; // TODO: разобраться откуда взялось дублирование данных
    }
    this.isImage = /^.*\.(jpe?g|gif|png|bmp)$/i.test(this.raw.name);
  }

  setAttached(attached: boolean): FileItem {
    this.attached = attached;
    return this;
  }

  urlToFile(type = this.item?.objectTypeId): string {
    if (!this.isRawMock) {
      return window.URL.createObjectURL(this.raw);
    }

    return this.item
      ? `${this.fileUploadApiUrl}/${this.item?.objectId}/${type}/download?mnemonic=${this.item?.mnemonic}`
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

  setDescription(description: string): FileItem {
    this.item.description = description;
    return this;
  }

  createUploadedParams(): TerraFileOptions {
    return {
      objectId: this.item.objectId,
      objectType: this.item.objectTypeId,
      objectTypeId: this.item.objectTypeId,
      mnemonic: this.item.mnemonic,
      mimeType: this.item.mimeType,
    } as TerraFileOptions;
  }

  getMimeType(): string {
    const type = this.raw?.type || this.item?.mimeType || '';

    return type.length > 0 ? type : mimeTypeByExtension[this.getType().toLowerCase()] || '';
  }

  createUploadOptions(
    objectId: string,
    objectType: number,
    mnemonic: string,
  ): TerraUploadFileOptions {
    return {
      name: this.raw.name,
      mimeType: this.getMimeType(),
      objectId: objectId,
      objectType: objectType,
      mnemonic: mnemonic,
    } as TerraUploadFileOptions;
  }

  getType(): string {
    const name = this.raw?.name || this.item?.fileName;
    return name.split('.').pop().toUpperCase();
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
export type OperationHandler = (
  operation: Operation,
  oldStatus: FileItemStatus,
) => Observable<void>;
export interface Operation {
  type: OperationType;
  cancel: BehaviorSubject<boolean>; // Если сюда отправить true операция будет отменена
  item: FileItem;
  handler: OperationHandler;
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
export const getSizeInKB = (bytes): number => Math.round(bytes / BYTES_IN_KB + Number.EPSILON);

/**
 * Возвращает размер в мегабайтах из байт
 * @param bytes - байты для перевода
 */
export const getSizeInMB = (bytes): number =>
  Math.round((bytes / BYTES_IN_KB / BYTES_IN_KB + Number.EPSILON) * 100) / 100;

export const plurals = {
  files: ['файл', 'файла', 'файлов'],
  attach: ['прикрепился', 'прикрепилось', 'прикрепилось'],
  before: ['', 'до', 'до'],
  uploadingFiles: ['файл', 'ещё', 'ещё'],
  choosingFiles: ['файл', 'файлы', 'файлы'],
};

export const beforeFilesPlural = ['файл', 'файлов', 'файлов'];

export const getAcceptTypes = (
  types: string[],
  prefix = '.',
  postfix = ',',
  caseType: 'lower' | 'upper' = 'lower',
): string => {
  const caseName = caseType === 'lower' ? 'toLowerCase' : 'toUpperCase';
  return !types?.length
    ? null
    : types
        .map((fileType) => `${prefix}${fileType}`)
        .join(postfix)
        [caseName]();
};

export const createError = (
  action: ErrorActions,
  data: FileUploadItem,
  typeList: string[],
  totalSize: number = 0,
): FileItemError => {
  const errorHandler = {};
  errorHandler[ErrorActions.addMaxTotalSize] = {
    text: `Файл тяжелее ${getSizeInMB(totalSize)} МБ`,
    description: 'Попробуйте уменьшить размер или загрузите файл полегче',
  };
  errorHandler[ErrorActions.addMaxAmount] = {
    text: '',
    description: '',
  };
  errorHandler[ErrorActions.addMaxTotalAmount] = {
    text: '',
    description: '',
  };
  errorHandler[ErrorActions.addMaxSize] = {
    text: `Файл тяжелее ${getSizeInMB(data.maxSize)} МБ`,
    description: 'Попробуйте уменьшить размер или загрузите файл полегче',
  };

  errorHandler[ErrorActions.addMinSize] = {
    text: 'Файл повреждён',
    description: 'Что-то не так с файлом. Попробуйте заменить на другой',
  };

  const types = getAcceptTypes(typeList, '', ', ', 'upper');

  errorHandler[ErrorActions.addInvalidType] = {
    text: 'Проверьте формат файла',
    description: `Попробуйте заменить на другой. Доступны для загрузки ${types}`,
  };
  errorHandler[ErrorActions.addInvalidFile] = {
    text: 'Файл повреждён',
    description: 'Что-то не так с файлом. Попробуйте заменить на другой',
  };
  errorHandler[ErrorActions.addDownloadErr] = {
    text: 'Ошибка при скачивании',
    description: 'Не удалось скачать файл. Попробуйте снова',
  };
  errorHandler[ErrorActions.addUploadErr] = {
    text: 'Ошибка при загрузке',
    description: 'Попробуйте отправить снова или замените документ.',
  };
  errorHandler[ErrorActions.addDeletionErr] = {
    text: 'Ошибка при удалении',
    description: 'Не получилось удалить файл. Попробуйте снова',
  };

  return { ...errorHandler[action], type: action };
};

export interface OverLimitsItem {
  count: number;
  isMax: boolean;
}
export interface OverLimits {
  totalSize: OverLimitsItem;
  totalAmount: OverLimitsItem;
  amount: OverLimitsItem;
}
