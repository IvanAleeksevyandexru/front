/**
 * Интерфейс для JSON секции загрузки связанных файлов с родителем и доп. данными
 */
export interface IEPGURelatedUploadsSection{
  ref: string;
  idAttrs: string[];
  uploads: IEPGUUploadSection[];
}

/**
 * Интерфейс для JSON секции загрузки файлов
 *
 * @property uploadId - идентификатор формы загрузки
 * @property type - тип загрузки (single или cycle)
 * @property fileType - массив расширений файлов на загрузку (PDF, JPG и т.д.)
 * @property maxSize - максимальное количество байт на загрузку
 * @property maxFileCount - максимальное количество файлов на загрузку
 * @property relatedUploads - связанные дополнительные документы на подгрузку
 */
export interface IEPGUUploadSection {
  uploadId: string,
  type: string,
  label: string,
  fileType: string[],
  maxSize: number,
  maxFileCount?: number,
  relatedUploads?: IEPGURelatedUploadsSection
}
