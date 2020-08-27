/**
 * Интерфейс для опций файла, при получении обновлении или удалении
 */
export interface ITerraFileOptions{
  objectId: number; //идентификатор объекта, к которому прикреплён файл
  objectType: number; //тип объекта, к которому прикреплён файл
  mnemonic: string; //мнемоника файла
}
/**
 * Интерфейс для опций загрузки файла на сервер
 */
export interface ITerraUploadFileOptions extends ITerraFileOptions{
  name: string;
  chunks?: number;
  chunk?: number;
}

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
