import { ScreenTypes } from '../../../shared/types/screen.types';

export type Gender = 'M' | 'F';

export interface Answer {
  visited: boolean,
  value: string,
}

export interface ApplicantAnswers {
  [key: string]: Answer
}

export interface CurrentValue {
  [key: string]: Answer
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
export interface ComponentBase {
  attrs: {[key: string]: any};
  id: string;
  label: string;
  type: string;
  value: string;
  required?: boolean
  visited?: boolean
}

/**
 * @property {}components
 * @property {string}header - текстовый заголовок компонента
 * @property {string}id - идентификатор экрана
 * @property {string}name - краткая информация о том что за компонент (на фронте не используется)
 * @property {string}submitLabel - текст для submit-button'a
 * @property {ScreenTypes}type - тип компонента
 */
export interface Display {
  components: Array<ComponentBase>;
  header: string;
  label?: string;
  id: string;
  name: string;
  submitLabel: string;
  type: ScreenTypes;
}

export interface CurrentCycledFields {
  [key: string]: string
}

/**
 * @property {Object}applicantAnswers - состояние компонента на backend(-e), для воостановление данных.
 * @property {number}currentRule - id сценария для управление порядком компонентов (наверное не нужен для фронта)
 * @property {object}currentValue - для отправляемых данных
 * @property {Display}display - текущий экран с компонентами и данными для отрисовки
 * @property {string}gender- пол пользователя
 * @property {string}orderId - идентификатор запорлнения черновика, (уже был черновик...)
 * @property {Array<object>}sendNotification - собственники жилья
 * (человек 1, человек 2) => эти людям прилетает уведомление о подтверждении ...
 * @property {string}token - в целях разработки, на проде через cookie;
 * @property {string}userId - в целях разработки, скорее всего переедет в cookie;
 *
 */
export interface ScenarioDto {
  applicantAnswers: ApplicantAnswers;
  currentRule: number;
  currentValue: CurrentValue;
  currentCycledFields: CurrentCycledFields;
  cycledFields: Array<object>;
  display: Display;
  errors: object;
  gender: Gender;
  orderId: string;
  sendNotification: Array<object>;
  token: string;
  userId: string;
  finishedAndCurrentScreens: [];
}

export interface FormPlayerApiSuccessResponse {
  scenarioDto: ScenarioDto;
}

export enum FormPlayerApiErrorStatuses {
  badRequest = 'BAD_REQUEST'
}

export interface FormPlayerApiErrorResponse {
  description: string;
  message: string;
  status: FormPlayerApiErrorStatuses;
}

export type FormPlayerApiResponse = FormPlayerApiSuccessResponse | FormPlayerApiErrorResponse;
