/**
 * @property {string}[componentId] - идентификатор app компаненты из услуги, необходим для проверки при переходах.
 * @property {string}[componentType] - тип app компаненты из услуги, необходим для проверки при переходах.
 * @property {string}[value] - json like строка с содержимым для запуска app с нужным стором.
 *   Должна будет серелизоваться в AppValue тип.
 * @property {boolean}[isPrevStepCase] - флаг для передачи контекста сквозной навигации по услуги.
 */
export interface OutputAppDto {
  componentId: string;
  componentType: string;
  value: string;
  isPrevStepCase: boolean;
}
