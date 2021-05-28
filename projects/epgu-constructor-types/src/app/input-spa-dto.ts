/**
 * @property {string}[componentId] - идентификатор app компаненты из услуги, необходим для проверки при переходах.
 * @property {string}[componentType] - тип app компаненты из услуги, необходим для проверки при переходах.
 * @property {string}[callbackRedirectUrl] - url услуги из которой открываем app, при выходи будет использоваться для перехода.
 * @property {string}[value] - json like строка с содержимым для запуска app с нужным стором, обычно берём из cachedAnswers.
 */
export interface InputSpaDto {
  componentId: string;
  componentType: string;
  callbackRedirectUrl: string;
  value: string;
}
