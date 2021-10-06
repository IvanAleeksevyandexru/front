import { Clarifications } from '@epgu/epgu-constructor-types';

export interface Chunk {
  chunk: number;
  form: FormData;
}

export type ChunkPacket = FormData[];

/**
 * Интерфейс для опций файла, при получении обновлении или удалении
 */

export interface TerraFileOptions {
  objectId: string; //идентификатор объекта, к которому прикреплён файл
  objectType: number; //тип объекта, к которому прикреплён файл
  mnemonic: string; //мнемоника файла
  mimeType?: string;
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
  uploadId?: string;
  required?: boolean;
  value?: UploadedFile[];
  errors?: string[];
  pdfFileName?: string;
  files?: FileResponseToBackendUploadsItem[];
}

/**
 * Интерфейс для аттрибутов файла на загрузку из JSON
 */
export interface FileUploadAttributes {
  clarifications: Clarifications;
  uploads: FileUploadItem[];
  uploadId?: string;
  maxSize?: number;
  maxFileCount?: number;
  minFileCount?: number;
  hideTotalAvailableSize?: boolean;
  hideTotalAvailableCount?: boolean;
}

export interface MaxCountByType {
  type: string[];
  maxFileCount: number;
}

export interface FileUploadValidation {
  value: string;
  errorMsg: string;
}

/**
 * Интерфейс для файла на загругку из JSON
 */
export interface FileUploadItem {
  uploadId: string;
  label: string;
  notCompression?: boolean;
  labelHint?: string;
  title?: string;
  fileType?: string[];
  maxFileCount?: number;
  maxSize?: number;
  minSize?: number;
  required?: boolean;
  pdfFileName?: string;
  maxCountByTypes?: MaxCountByType[];
  readonly?: boolean;
  isPreviewPhoto?: boolean;
  validation?: FileUploadValidation[];
}

/**
 * Интерфейс для класса подгруженного файла
 */
export interface UploadedFile {
  alternativeMimeTypes?: string[];
  bucket?: string;
  created?: string;
  deleted?: boolean;
  description: string;
  fileExt?: string;
  fileName: string;
  fileSize: number;
  fileUid?: number;
  hasError: boolean;
  hasSign?: boolean;
  isFromSuggests?: boolean;
  metaId?: number;
  mimeType?: string;
  mnemonic: string;
  nodeId?: string;
  objectId: string;
  objectType?: number;
  objectTypeId: number;
  previewType?: number;
  realPath?: string;
  relativePath?: string;
  updated?: string;
  uploaded: boolean;
  userId?: number;
}

/**
 * Интерфейс для события значений файлов
 */
export interface FileUploadEmitValue {
  uploadId: string;
  value: UploadedFile[];
  pdfFileName?: string;
  required: boolean;
}

/**
 * Интерфейс для события значений файлов применительно к блоку для загрузки
 */
export interface FileUploadEmitValueForComponent {
  id: string;
  totalSize?: number;
  type: string;
  uploads?: FileUploadEmitValue[];
}
