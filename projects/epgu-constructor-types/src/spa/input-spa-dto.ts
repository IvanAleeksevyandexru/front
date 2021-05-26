/**
 * @property {string}[componentId] - идентификатор spa компаненты из услуги, необходим для передачи данных при закрытии.
 * @property {string}[callbackRedirectUrl] - url услуги из которой открываем spa, при выходи будет использоваться для перехода.
 * @property {string}[value] - json like строка с содержимым для запуска spa с нужным стором, обычно берём из cachedAnswers.
 */
export interface InputSpaDto {
  componentId: string;
  callbackRedirectUrl: string;
  value: string;
}
