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

/**
 * Тип загружаемого документа
 */
export const uploadObjectType = 2;

/**
 * Количество байт в килобайте
 */
export const BYTES_IN_KB = 1024;

// eslint-disable-next-line max-len
export const TERABYTE_TEST_TOKEN = 'eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJuYmYiOjE1OTc2NzM4OTQsInNjb3BlIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcL3Vzcl9pbmY_b2lkPTEwMDAyOTkzNTMmbW9kZT13IiwiaXNzIjoiaHR0cDpcL1wvZXNpYS5nb3N1c2x1Z2kucnVcLyIsInVybjplc2lhOnNpZCI6IjNlODAwMmI0NzYwY2QwNGRlN2NjYmIzYzM4M2ZjNTIwNTlmYTgyYmJkNmY0ZDM5MmUyYmZlMjNkODY1YmM5ODIiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAyOTkzNTMsImV4cCI6MTU5Nzc2MDI5NCwiaWF0IjoxNTk3NjczODk0LCJjbGllbnRfaWQiOiJQR1UifQ.GhwBnGje2wCAWrlWcEA7y8KJd9FQcwyP9KOj4Ge2-1YWeQqnIcHm2oD_5Z_d0ymi9AZvyPBikHsD9F9XNGFpA7wvcLjwnqb5p8cb5uGc4taaX2hsnBGpgZdmeVB6sY-SNH68Cyy7f8acaNeRdC4sW0S14hELdUZ5F_5xmC8Lp3Pa4TMnEuYcSNUZgD_mQ4nUizgS7LRF0G9NLx4JGTPwyY4mIv8GAO_-leaYQFyf13lRQ5G18S5G7bdMu-m-9Vdzpm0PVLjz9D6zwN0z9I_vx1L7nFuvpBDf1UzjYA7XJIlnTzTbYPaZu4_icd2L8V34sgt_xRK5Sx3fUAjuw-gOpA';

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
