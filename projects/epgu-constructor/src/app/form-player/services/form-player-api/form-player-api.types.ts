// eslint-disable-next-line max-len
import { ConfirmUserDataStyle } from '../../../component/unique-screen/components/confirm-personal-user-data-screen/confirm-personal-user-data-screen.types';
import {
  TimerComponentDtoAction,
  TimerLabelSection,
} from '../../../shared/components/timer/timer.interface';
import {
  DictionaryConditions,
  DictionaryOptions,
} from '../../../component/shared/services/dictionary-api/dictionary-api.types';
import { Clarifications } from '../../../component/unique-screen/services/terra-byte-api/terra-byte-api.types';
import { ScreenTypes } from '../../../screen/screen.types';
import { Answer } from '../../../shared/types/answer';
import { Gender } from '../../../shared/types/gender';
import { TextTransform } from '../../../shared/types/textTransform';
import { CarInfoErrorsDto } from '../../../component/unique-screen/components/car-info/models/car-info.interface';

export interface ApplicantAnswersDto {
  [key: string]: Answer;
}

export interface CachedAnswersDto {
  [key: string]: Answer;
}

export interface CurrentValueDto {
  [key: string]: Answer;
}

export type colorDto = 'white' | 'transparent' | '';

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
  attrs: ComponentAttrsDto;
  id: string;
  label?: string;
  type: string;
  value?: string;
  required?: boolean;
  visited?: boolean;
  presetValue?: string;
  valueFromCache?: boolean;
}

export interface ComponentAnswerDto {
  label: string;
  value: string;
  type: string;
  action: string;
  hidden?: boolean;
  disabled?: boolean;
  link?: string;
  hint?: string;
  underConstruction?: boolean;
}

export interface ComponentAttrsDto {
  actions?: Array<ComponentActionDto>;
  answers?: Array<ComponentAnswerDto>;
  clarifications?: ClarificationsDto;
  fields?: Array<ComponentFieldDto>;
  dictionaryType?: Array<string> | string; //TODO: прояснить почему либо массив объектов либо строка
  ref?: Array<ComponentRefDto> | string | { fiasCode: string }; //TODO: прояснить почему либо массив объектов либо строка
  validation?: Array<ComponentValidationDto>;
  mask?: Array<string>;
  relationField?: ComponentRelationFieldDto;
  minDate?: string;
  maxDate?: string;
  preset?: ComponentPresetDto;
  components?: Array<ComponentDto>;
  repeatAmount?: number;
  link?: string;
  state?: string;
  states?: ComponentStatesDto;
  characterMask?: string; //TODO: в json нет этого атрибута, но в коде есть, возможно рудимент
  codeLength?: number; //TODO: в json нет этого атрибута, но в коде есть, возможно рудимент
  resendCodeUrl?: string; //TODO: в json нет этого атрибута, но в коде есть, возможно рудимент
  isNeedToCheckGIBDDPayment?: boolean;
  dictionaryGIBDD?: string;
  checkedParametersGIBDD?: Array<string>;
  GIBDDpaymentError?: ComponentGIBDDpaymentErrorDto;
  attributeNameWithAddress?: string;
  dictionaryFilter?: Array<ComponentDictionaryFilterDto>;
  baloonContent?: Array<ComponentBaloonContentDto>;
  addressString?: ComponentAddressStringDto;
  value?: string;
  visited?: boolean;
  years?: number;
  nonStop?: boolean;
  restrictions?: ComponentRestrictionsDto;
  applicantType?: string;
  image?: ComponentImageDto;
  labelAttr?: string;
  labelHint?: string;
  hint?: string;
  russia?: boolean;
  ussr?: boolean;
  accuracy?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  defaultValue?: boolean;
  filter?: ComponentFilterDto;
  defaultIndex?: number;
  startTime?: string;
  expirationTime?: string;
  timerRules?: TimerRulesDto;
  refs?: RefsTimeDto;
  autoMapFocus?: boolean; //TODO: в json нет этого атрибута, но в коде есть, возможно рудимент
  selectedValue?: string;
  fstuc?: TextTransform;
  payCode?: number;
  goNextAfterUIN?: boolean;
  nsi?: string;
  dictItemCode?: string;
  uploadedFile?: ComponentUploadedFileDto;
  validateMessage?: string; //TODO: в json нет этого атрибута, но в коде есть, возможно рудимент
  dictionaryOptions?: DictionaryOptions;
  style?: ConfirmUserDataStyle;
  imgSrc?: string;
  error?: { imgSrc: string; label: string };
  success?: { imgSrc: string; label: string };
  helperText?: string;
  label?: string;
  sendEmailLabel?: string;
  redirectLabel?: string;
  repeatableComponents?: Array<Array<ComponentDto>>;
  singleChild?: boolean;
  minDateRef?: string;
  maxDateRef?: string;
  hideSocialShare?: boolean;
  addContextQueryParams?: boolean;
  infoComponents?: string[];
  errors?: CarInfoErrorsDto;
  add?: { component: string; caption: string[] };
  hideAddNewChildButton?: boolean;
}

export interface ComponentUploadedFileDto {
  fileType?: string[];
  mnemonic: string;
  name: string;
  objectType: number;
  objectId: string;
  fileExt?: string;
  fileName?: string;
  fileSize?: number;
  fileUid?: number;
  hasSign?: boolean;
  metaId?: number;
  mimeType?: string;
  nodeId?: string;
  objectTypeId?: number;
  realPath?: string;
  uploaded?: boolean;
  userId?: number;
  hasError?: boolean;
  created?: string;
  updated?: string;
  deleted?: boolean;
}

export interface RefsTimeDto {
  timeStartRef: string;
  timeFinishRef: string;
  visitTimeRef: string;
}

export interface TimerRulesDto {
  hideTimerFrom?: number;
  warningColorFromTime?: number;
  labels?: TimerLabelSection[];
  actions?: TimerComponentDtoAction[];
}

export interface ComponentFilterDto {
  key: string;
  value: Array<string>;
}

export interface ComponentImageDto {
  src: string;
  alt: string;
}

export interface ComponentRestrictionsDto {
  minDate: [number, string];
  maxDate: [number, string];
}

export interface ComponentAddressStringDto {
  type: string;
  value: string;
}

export interface ComponentBaloonContentDto {
  name: string;
  label: string;
}

export interface ComponentDictionaryFilterDto {
  attributeName: string;
  condition: DictionaryConditions;
  value: string;
  valueType: string;
}

export interface ComponentGIBDDpaymentErrorDto {
  text: string;
  title: string;
  buttons: Array<{
    label: string;
    closeModal: boolean;
    color?: colorDto;
    value?: boolean;
  }>;
}

export interface ComponentStatesDto {
  [key: string]: {
    actions: Array<ComponentActionDto>;
    body: string;
    header: string;
    subHeader: string;
    clarifications: ClarificationsDto;
    srcImg?: string;
  };
}

export interface ComponentPresetDto {
  type: string;
  value: string;
}

export interface ComponentRelationFieldDto {
  ref: string;
  conditions: Array<{
    type: 'RegExp' | 'MinDate' | 'MaxDate';
    value: string;
    result: {
      attrs: ComponentAttrsDto;
    };
  }>;
}

export interface ComponentValidationDto {
  type: string;
  value: string;
  ref: string;
  dataType: string;
  condition: string;
  errorMsg: string;
}

export interface ComponentRefDto {
  relatedDate: string;
  val: string;
  period: string;
  condition: string;
}

export interface ComponentFieldDto {
  fieldName?: string;
  label?: string;
}

export interface ClarificationsDto {
  [key: string]: {
    title: string;
    text: string;
    setting?: {};
  };
}

export interface ComponentActionDto {
  label: string;
  value: string;
  action: DTOActionAction;
  type?: ActionType;
  hidden?: boolean;
  disabled?: boolean;
  applicantType?: string;
  color?: colorDto;
  link?: string;
  underConstruction?: boolean;
  hint?: string;
  attrs?: {
    stepsBack?: number;
  };
}

export interface ScreenActionDto extends ComponentActionDto {}

export interface DisplaySubjHead {
  text: string;
  clarifications: Clarifications;
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
  id: string;
  name: string;
  header: string;
  submitLabel: string;
  components: Array<ComponentDto>;
  type: ScreenTypes;
  terminal: boolean;
  firstScreen?: boolean;
  subHeader?: DisplaySubjHead;
  label?: string;
  cssClass?: string;
  isSocialButtonsHidden?: boolean;
  displayCssClass?: string;
  buttons?: Array<ScreenActionDto>;
  infoComponents?: string[];
}

export interface ScenarioErrorsDto {
  [key: string]: string;
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
  currentScenarioId: string;
  cachedAnswers: CachedAnswersDto;
  currentValue: CurrentValueDto;
  display: DisplayDto;
  errors: ScenarioErrorsDto;
  gender: Gender;
  finishedAndCurrentScreens: string[];
  orderId: string;
  callBackOrderId?: string;
  isInternalScenario?: boolean;
  serviceId?: string;
  currentUrl?: string;
  newContactId?: string;
}

/**
 * @property {boolean}[isInternalScenario] - есть шаги когда мы выходим из основного сценария в подсценарий,
 * тогда DTO обагатится этим самым полем, который в значении true говорит что мы находимся в подсценарии,
 * а значение false, сообщит backend(-у) что нужно удалить это свойство из DTO и выйти из подсценария
 */
export interface FormPlayerApiSuccessResponse {
  scenarioDto: ScenarioDto;
  isInternalScenario?: boolean;
}

export interface QuizRequestDto extends FormPlayerApiSuccessResponse {
  serviceId: string;
  targetId: string;
}

export enum FormPlayerApiErrorStatuses {
  badRequest = 'BAD_REQUEST',
}

export interface FormPlayerApiErrorResponse {
  description: string;
  message: string;
  status: FormPlayerApiErrorStatuses;
}

export type FormPlayerApiResponse = FormPlayerApiSuccessResponse | FormPlayerApiErrorResponse;

export enum ButtonType {
  anchor = 'anchor',
  search = 'search',
  button = 'button',
}

export enum ActionType {
  download = 'download',
  prevStepModal = 'prevStepModal',
  nextStepModal = 'nextStepModal',
  modalRedirectTo = 'modalRedirectTo',
  prevStep = 'prevStep',
  nextStep = 'nextStep',
  skipStep = 'skipStep',
  redirectToLK = 'redirectToLK',
  quizToOrder = 'quizToOrder',
  profileEdit = 'profileEdit',
  home = 'home',
}

export enum DTOActionAction {
  getNextStep = 'getNextScreen',
  getPrevStep = 'getPrevScreen',
  skipStep = 'skipStep',
  reject = 'reject',
  editPhoneNumber = 'service/actions/editPhoneNumber',
  editEmail = 'service/actions/editUserEmail',
  goBackToMainScenario = 'goBackToMainScenario',
  resendEmailConfirmation = 'service/actions/resendEmailConfirmation',
}

export interface CheckOrderApiResponse {
  orderId: string;
  isInviteScenario: boolean;
  canStartNew: boolean;
}

export interface ActionDTO<T = {}> {
  scenarioDto: Partial<ScenarioDto>;
  additionalParams?: T;
}

export interface ActionApiResponse<T> {
  errorList: { [key: string]: string }[];
  responseData: { value: T; type: string };
}
