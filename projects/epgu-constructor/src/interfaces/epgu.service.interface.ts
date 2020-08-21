import { COMPONENT_TYPE } from '../constant/global';

/**
 * @property {Object}applicantAnswers - состояние компонента на backend(-e), для воостановление данных.
 * @property {number}currentRule - id сценария для управление порядком компонентов (наверное не нужен для фронта)
 * @property {object}currentValue - для отправляемых данных
 * @property {EgpuResponseDisplayInterface}display -
 * @property {string}gender
 * @property {string}orderId - идентификатор запорлнения черновика, (уже был черновик...)
 * @property {Array<object>>}sendNotification - собственники жилья
 * (человек 1, человек 2) => эти людям прилетает уведомление о подтверждении ...
 * @property {string}token - в целях разработки, на продее через cookie;
 * @property {string}userId - в целях разработки, скорее всего переедет в cookie;
 *
 */
export interface EgpuResponseInterface {
  applicantAnswers: object;
  currentRule: number;
  currentValue: object;
  display: EgpuResponseDisplayInterface;
  errors: object;
  gender: number;
  orderId: string;
  sendNotification: Array<object>;
  token: string
  userId: string
}

/**
 * @property {}components
 * @property {string}header - text in component header
 * @property {string}id -
 * @property {string}name - краткая информация о том что за компонент (на фронде не используется)
 * @property {string}submitLabel - text for submit button
 * @property {COMPONENT_TYPE}type - тип компонента
 */
export interface EgpuResponseDisplayInterface {
  components: Array<EgpuResponseComponentInterface>;
  header: string;
  id: string;
  name: string;
  submitLabel: string;
  type: COMPONENT_TYPE;
}

/**
 * @property {Array<object>}attrs - обеъект с дополнительной информацией
 * (например для select элементов могут приходить словари)
 * @property {string}id -
 * @property {string}label - может храниться разное строковое значение
 * (например в некоторый случаях в строке будет сожержаться html разметка);
 * @property {string}type - component name
 * @property {string}value - может храниться разное строковое значение
 * (например проверка персональные данные будут содержать json с персональными данными)
 * @property {boolean}visited?
 */
export interface EgpuResponseComponentInterface {
  attrs: object;
  id: string;
  label: string;
  type: string;
  value: string;
  visited?: boolean
}


export interface EgpuResponseCurrentValue {
  visited: boolean;
  value: any;
}
