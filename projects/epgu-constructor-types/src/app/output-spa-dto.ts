/**
 * @property {string}[componentId] - идентификатор app компаненты из услуги, необходим для проверки при переходах.
 * @property {string}[componentType] - тип app компаненты из услуги, необходим для проверки при переходах.
 * @property {string}[value] - json like строка с содержимым для запуска app с нужным стором.
 */
export interface OutputSpaDto {
  componentId: string;
  componentType: string;
  value: string;
}
