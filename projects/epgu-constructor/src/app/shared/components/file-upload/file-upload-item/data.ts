import {
  FileUploadItem,
  MaxCountByType,
  TerabyteListItem,
  TerraFileOptions,
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';
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
  lastSelected?: MaxCountByType;

  getUniqueTypes(without?: FileItem): string[] {
    const files = this.files.getValue();
    const useFiles = without ? files.filter((file) => file.id !== without.id) : files;
    return Array.from(new Set(useFiles.map((v) => v.getType())));
  }

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
        type: item.mimeType || '',
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

  getType(): string {
    return this.raw.name.split('.').pop().toUpperCase();
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

export const plurals = {
  files: ['файл', 'файла', 'файлов'],
  attach: ['прикрепился', 'прикрепилось', 'прикрепилось'],
  before: ['', 'до', 'до'],
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
  store: FileItemStore,
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
  getAcceptTypes(data.fileType, '', ', ', 'upper');

  const types = store?.lastSelected
    ? getAcceptTypes(store?.lastSelected.type, '', ', ', 'upper')
    : getAcceptTypes(data.fileType, '', ', ', 'upper');

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

export const updateLimits = (
  config: FileUploadItem,
  store: FileItemStore,
  amount: number,
  file?: FileItem,
  isAdd = true,
): void => {
  if (!(config?.maxCountByTypes?.length > 0)) {
    return;
  }
  const types = store.getUniqueTypes(!isAdd && file ? file : null);
  if (isAdd && file && !types.includes(file.getType())) {
    types.push(file.getType());
  }

  const findedType = config?.maxCountByTypes.find(({ type }) =>
    types.every((fileType) => type.includes(fileType)),
  );

  if (findedType) {
    if (!store.lastSelected || findedType.maxFileCount >= amount) {
      store.lastSelected = findedType;
    }
  }
  if (types.length === 0) {
    store.lastSelected = config?.maxCountByTypes.reduce(
      (acc, v) => {
        acc.maxFileCount += v.maxFileCount;
        acc.type = acc.type
          .concat(v.type)
          .filter((item, index, arr) => arr.indexOf(item) === index);
        return acc;
      },
      {
        type: [],
        maxFileCount: 0,
      },
    );
  }
};
