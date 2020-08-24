import {SCREEN_TYPE} from '../constant/global';

/**
 * @property {Object}applicantAnswers - состояние компонента на backend(-e), для воостановление данных.
 * @property {number}currentRule - id сценария для управление порядком компонентов (наверное не нужен для фронта)
 * @property {object}currentValue - для отправляемых данных
 * @property {DisplayInterface}display - текущий экран с компонентами и данными для отрисовки
 * @property {string}gender- пол пользователя
 * @property {string}orderId - идентификатор запорлнения черновика, (уже был черновик...)
 * @property {Array<object>}sendNotification - собственники жилья
 * (человек 1, человек 2) => эти людям прилетает уведомление о подтверждении ...
 * @property {string}token - в целях разработки, на проде через cookie;
 * @property {string}userId - в целях разработки, скорее всего переедет в cookie;
 *
 */
export interface ResponseInterface {
  applicantAnswers: {[key: string]: any};
  currentRule: number;
  currentValue: object;
  display: DisplayInterface;
  errors: object;
  gender: number;
  orderId: string;
  sendNotification: Array<object>;
  token: string
  userId: string
}

/**
 * @property {}components
 * @property {string}header - текстовый заголовок компонента
 * @property {string}id - идентификатор экрана
 * @property {string}name - краткая информация о том что за компонент (на фронте не используется)
 * @property {string}submitLabel - текст для submit-button'a
 * @property {SCREEN_TYPE}type - тип компонента
 */
export interface DisplayInterface {
  components: Array<ComponentInterface>;
  header: string;
  label?: string;
  id: string;
  name: string;
  submitLabel: string;
  type: SCREEN_TYPE;
}

/**
 * @property {Array<object>}attrs - объект с дополнительной информацией
 * (например для select элементов могут приходить словари)
 * @property {string}id - идентификатор компонента
 * @property {string}label - может храниться разное строковое значение
 * (например в некоторый случаях в строке будет сожержаться html разметка);
 * @property {string}type - component name
 * @property {string}value - может храниться разное строковое значение
 * (например проверка персональные данные будут содержать json с персональными данными)
 * @property {boolean}visited? - булевый флаг пройдена ли пользователем бизнес-логика данного компонента
 */
export interface ComponentInterface {
  attrs: object;
  id: string;
  label: string;
  type: string;
  value: string;
  visited?: boolean
}

export interface CurrentValue {
  visited: boolean;
  value: any;
}
