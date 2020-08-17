/**
 * Конфиг сервиса TERRABYTE для хранения данных
 */
export const TerabyteConfig = {
  API_URL: 'https://gosuslugi.ru/api/storage/v1/files',
  LOCALHOST_API_URL: '/terrabyte',
}

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
 * Качество фото с камеры в котором будет сохраняться
 */
export const imageCameraQuality = 0.9;
