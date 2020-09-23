/**
 * Интерфейс для опций файла, при получении обновлении или удалении
 */
export interface TerraFileOptions {
  objectId: number; //идентификатор объекта, к которому прикреплён файл
  objectType: number; //тип объекта, к которому прикреплён файл
  mnemonic: string; //мнемоника файла
}
/**
 * Интерфейс для опций загрузки файла на сервер
 */
export interface TerraUploadFileOptions extends TerraFileOptions {
  name: string;
  chunks?: number;
  chunk?: number;
}

/**
 * Интерфейс для экспорта одного значения для компонента загрузки
 */
export interface FileResponseToBackendUploadsItem {
  uploadId: string;
  value?: UploadedFile[]
  relatedUploads?: {
    uploads: FileResponseToBackendUploadsItem[]
  }
}
/**
 * Интерфейс для экспорта одного значения для компонента загрузки для связанных компонентов
 */
export interface FileResponseToBackendWithRelatedUploads {
  uploadId: string;
  uploads?: FileResponseToBackendUploadsItem[]
}

/**
 * Интерфейс для аттрибутов файла на загрузку из JSON
 */
export interface FileUploadAttributes {
  clarifications: Array<Clarifications>;
  uploads: FileUploadItem[],
  uploadId?: string;
  idAttrs?: string[];
  ref?: string;
  maxSize?: number;
  maxFileCount?: number;
}

export interface Clarifications {
  [key: string]: {
    text?: string;
  }
}


/**
 * Интерфейс для связанных файлов на загрузки из JSON
 */
export interface RelatedUploads extends FileUploadAttributes {
  ref: string;
  idAttrs: string[];
}

/**
 * Интерфейс для файла на загругку из JSON
 */
export interface FileUploadItem {
  uploadId: string;
  label: string;
  fileType: string[];
  maxFileCount?: number;
  maxSize?: number;
  relatedUploads?: RelatedUploads
}

/**
 * Интерфейс для класса подгруженного файла
 */
export interface UploadedFile {
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
export interface TerabyteListItem{
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
