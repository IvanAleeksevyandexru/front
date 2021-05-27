/**
 * @property {string}[componentId] - идентификатор spa компаненты из услуги, необходим для проверки при переходах.
 * @property {string}[componentType] - тип spa компаненты из услуги, необходим для проверки при переходах.
 * @property {string}[value] - json like строка с содержимым для запуска spa с нужным стором.
 */
export interface OutputSpaDto {
  componentId: string;
  componentType: string;
  value: string;
}
