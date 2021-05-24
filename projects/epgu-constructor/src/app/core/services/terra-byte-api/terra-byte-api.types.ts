import { TerraUploadedFile } from '../../../shared/components/file-upload/file-upload-item/data';
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
}

export interface MaxCountByType {
  type: string[];
  maxFileCount: number;
}

/**
 * Интерфейс для файла на загругку из JSON
 */
export interface FileUploadItem {
  uploadId: string;
  label: string;
  title?: string;
  fileType?: string[];
  maxFileCount?: number;
  maxSize?: number;
  required?: boolean;
  pdfFileName?: string;
  maxCountByTypes?: MaxCountByType[];
  readonly?: boolean;
}

/**
 * Интерфейс для класса подгруженного файла
 */
export interface UploadedFile {
  fileName: string;
  objectId: string;
  objectTypeId: number;
  mnemonic: string;
  uploaded: boolean;
  fileSize: number;
  hasError: boolean;
  mimeType?: string;
  alternativeMimeTypes?: string[];
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
  bucket?: string;
  isFromSuggests?: boolean;
}

/***
 * Интерфейс для файла из списка файлов в хранилище террабайт
 */
export interface TerabyteListItem {
  fileName: string;
  objectId: string;
  objectTypeId: number;
  mnemonic: string;
  updated: string;
  fileSize: number;
  alternativeMimeTypes: string[];
  created: string;
  deleted: boolean;
  fileExt: string;
  fileUid: number;
  hasSign: boolean;
  metaId: number;
  nodeId: string;
  realPath: string;
  relativePath: string;
  userId: number;
}

/**
 * Интерфейс для события значений файлов
 */
export interface FileUploadEmitValue {
  uploadId: string;
  value: TerraUploadedFile[];
  pdfFileName?: string;
  required: boolean;
}

/**
 * Интерфейс для события значений файлов применительно к блоку для загрузки
 */
export interface FileUploadEmitValueForComponent {
  id: string;
  type: string;
  uploads?: FileUploadEmitValue[];
}
