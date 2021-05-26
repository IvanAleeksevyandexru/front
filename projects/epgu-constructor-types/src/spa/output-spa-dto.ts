/**
 * @property {string}[componentId] - идентификатор spa компаненты из услуги,
 *   необходим для идентификации актуальности передаваемых данных.
 * @property {string}[value] - json like строка с содержимым для запуска spa с нужным стором.
 */
export interface OutputSpaDto {
  componentId: string;
  value: string;
}
