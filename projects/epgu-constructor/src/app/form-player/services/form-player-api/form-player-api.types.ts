import { ScreenTypes } from '../../../screen/screen.types';
import { Answer } from '../../../shared/types/answer';
import { Gender } from '../../../shared/types/gender';
import { Clarifications } from '../../../shared/services/terra-byte-api/terra-byte-api.types';

export interface ApplicantAnswersDto {
  [key: string]: Answer
}

export interface CachedAnswersDto {
  [key: string]: Answer
}

export interface CurrentValueDto {
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
export interface ComponentDto {
  attrs: {
    [key: string]: any,
    actions?: Array<ComponentDtoAction>
  };
  id: string;
  label: string;
  type: string;
  value: string;
  required?: boolean
  visited?: boolean
}

export interface ComponentDtoAction {
  label: string;
  value: string;
  action: string;
  type?: ActionType;
  hidden?: boolean;
  disabled?: boolean;
  applicantType?: string;
}

export interface DisplaySubjHead {
  text: string;
  clarifications: Clarifications
}

/**
 * @property {}components
 * @property {boolean}firstScreen - ствойсвто отвечает на вопрос, на первом ли экране мы находимся,
 * если экран не первый то свойства не должно быть
 * @property {string}header - текстовый заголовок компонента
 * @property {string}id - идентификатор экрана
 * @property {string}name - краткая информация о том что за компонент (на фронте не используется)
 * @property {string}submitLabel - текст для submit-button'a
 * @property {ScreenTypes}type - тип компонента
 */
export interface DisplayDto {
  components: Array<ComponentDto>;
  firstScreen?: boolean;
  header: string;
  subHeader?: DisplaySubjHead;
  label?: string;
  displayCssClass?: string;
  id: string;
  name: string;
  submitLabel: string;
  type: ScreenTypes;
  terminal: boolean;
  isSocialButtonsHidden?: boolean
}

export interface CurrentCycledFieldsDto {
  [key: string]: string
}

export interface ScenarioErrorsDto {
  [key: string]: string
}

/**
 * @property {Object}applicantAnswers - состояние компонента на backend(-e), для воостановление данных.
 * @property {number}currentRule - id сценария для управление порядком компонентов (наверное не нужен для фронта)
 * @property {object}currentValue - для отправляемых данных
 * @property {DisplayDto}display - текущий экран с компонентами и данными для отрисовки
 * @property {string}gender- пол пользователя
 * @property {string}orderId - идентификатор запорлнения черновика, (уже был черновик...)
 * (человек 1, человек 2) => эти людям прилетает уведомление о подтверждении ...
 * @property {string}token - в целях разработки, на проде через cookie;
 * @property {string}userId - в целях разработки, скорее всего переедет в cookie;
 * @property {boolean}[isInternalScenarioFinish] - появляется при internal сценарии;
 * @property {string}[serviceId] - добавляется при internal сценариев(подсценариев);
 * @property {string}[currentUrl] - текущий url, нужен бэкенду для возврата на страницу, если был переход на стороннюю страницу ;
 */
export interface ScenarioDto {
  applicantAnswers: ApplicantAnswersDto;
  currentCycledFields: CurrentCycledFieldsDto;
  currentScenarioId: string;
  cachedAnswers: CachedAnswersDto;
  currentValue: CurrentValueDto;
  cycledFields: Array<object>; // looks lice it unused property
  display: DisplayDto;
  errors: ScenarioErrorsDto;
  gender: Gender;
  finishedAndCurrentScreens: string[];
  orderId: string;
  token: string;
  userId: string;
  isInternalScenario?: boolean;
  serviceId?: string;
  currentUrl?: string;
}

/**
 * @property {boolean}[isInternalScenario] - есть шаги когда мы выходим из основного сценария в подсценарий,
 * тогда DTO обагатится этим самым полем, который в значении true говорит что мы находимся в подсценарии,
 * а значение false, сообщит backend(-у) что нужно удалить это свойство из DTO и выйти из подсценария
 */
export interface FormPlayerApiSuccessResponse {
  scenarioDto: ScenarioDto;
  isInternalScenario?: boolean
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

export enum ActionType {
  download = 'download',
  prevStep = 'prevStep',
  nextStep = 'nextStep',
  redirectToLK = 'redirectToLK',
  profileEdit = 'profileEdit',
  home = 'home',
  editPhoneNumber = 'service/actions/editPhoneNumber',
  editEmail = 'service/actions/editUserEmail',
}

export interface CheckOrderApiResponse {
  scenarioDto: ScenarioDto;
  isInviteScenario: boolean;
  canStartNew: boolean;
}

export interface ActionDTO<T = {}> {
  scenarioDto: Partial<ScenarioDto>;
  additionalParams?: T;
}

export interface ActionApiResponse<T> {
  errorList: { [key: string]: any }[];
  responseData: { value: T; type: string };
}
