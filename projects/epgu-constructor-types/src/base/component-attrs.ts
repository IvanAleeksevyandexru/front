import { ComponentActionDto } from './component-action-dto';
import { Clarifications } from './clarifications';
import { CustomComponentRef } from './custom-component-ref';
// eslint-disable-next-line import/no-cycle
import { ComponentDto } from './component-dto';
import { ComponentAnswerDto } from './qustion-component-answer';
import { ComponentDictionaryFilterDto, DictionaryOptions } from './dictionary';
import { TextTransform } from './text-transform';
import { ConfirmUserDataStyle } from './confirm-user-data';
import { TimerComponentDtoAction, TimerLabelSection } from './timer';
import { ColorDto } from './color';
import { ConfirmationModal } from '../modal';
import { KeyValueMap } from './core.types';
import { LogicComponentHeaders, LogicComponentMethods } from './logic-component';

export interface KindergartenAttrs {
  header?: string;
  label?: string;
  checkboxLabel?: string;
  finalScreenText?: string;
  listMaxLength?: number;
  nextStepLength?: number;
  attrs?: ComponentAttrsDto;
}

export interface ComponentAttrsDto {
  accuracy?: string;
  actions?: ComponentActionDto[];
  add?: { component: string; caption: string[] };
  addContextQueryParams?: boolean;
  addressString?: ComponentAddressStringDto;
  answers?: ComponentAnswerDto[];
  applicantType?: string;
  attributeNameWithAddress?: string;
  autoCenterAllPoints?: boolean;
  autoMapFocus?: boolean;
  baloonContent?: ComponentBaloonContentDto[];
  beginDate?: ComponentDateTimeDto;
  beginTime?: ComponentDateTimeDto;
  cacheRepeatableFieldsAnswersLocally?: boolean;
  cancelReservation?: string[];
  canDeleteFirstScreen?: boolean;
  characterMask?: string;
  checkedParametersGIBDD?: string[];
  clarifications?: Clarifications;
  codeLength?: number;
  components?: ComponentDto[];
  customUnrecLabel?: string;
  dateType?: string;
  daysToShow?: number;
  defaultIndex?: number;
  defaultValue?: boolean;
  dictionaryFilter?: ComponentDictionaryFilterDto[];
  dictionaryGIBDD?: string;
  dictionaryOptions?: DictionaryOptions;
  dictionaryType?: string[] | string;
  dictItemCode?: string;
  disabled?: boolean;
  disclaimer?: DisclaimerDto;
  defaultHint?: HintDto;
  displayShowTimeSeconds?: number;
  downloadLink?: string; // ссылка для скачивания файлов в empty screen
  emptySlotsModal?: ConfirmationModal;
  email?: string;
  endDate?: ComponentDateTimeDto;
  endTime?: ComponentDateTimeDto;
  error?: { imgSrc: string; label: string; buttons: ConfirmationModal['buttons'] };
  expandAllChildrenBlocks?: boolean;
  expirationTime?: string;
  fields?: ComponentFieldDto[];
  fieldGroups?: { groupName: string; visibilityLabel: string; fields: ComponentFieldDto[] };
  filter?: ComponentFilterDto;
  fio?: string;
  firstName?: string;
  fstuc?: TextTransform;
  gender?: string;
  GIBDDpaymentError?: ComponentGIBDDpaymentErrorDto;
  goNextAfterUIN?: boolean;
  helperText?: string;
  hidden?: boolean;
  hideAddNewChildButton?: boolean;
  hideCloneButton?: boolean;
  hideSocialShare?: boolean;
  hint?: string;
  hints?: Hints[];
  ignoreRootParams?: string[];
  image?: ComponentImageDto;
  imgSrc?: string;
  infoComponents?: string[];
  isMonthsRangeVisible?: boolean;
  isNeedToCheckGIBDDPayment?: boolean;
  isSelectButtonHidden?: boolean;
  label?: string;
  labelHint?: string;
  lastName?: string;
  link?: string;
  mapKindergartenPriorityAttrs?: KindergartenAttrs;
  mask?: string[];
  maxDate?: string;
  maxDateRef?: string;
  middleName?: string;
  minDate?: string;
  minDateRef?: string;
  minOccures?: number;
  muchTries?: { imgSrc: string; label: string; buttons: ConfirmationModal['buttons'] };
  mvdFilters?: IMvdFilter[]; // TODO: EPGUCORE-54425, Виктория Харитонова сказала что фильтрацию сделают на бэке. После этого нужно поле удалить это поле.
  noDepartmentsErrorMsg?: string;
  nonStop?: boolean;
  nsi?: string;
  obliged?: boolean;
  payCode?: number;
  phoneNumber?: number;
  placeholderText?: string;
  preset?: ComponentPresetDto;
  redirectLabel?: string;
  ref?: ComponentRefDto[] | string | { fiasCode: string } | CustomComponentRef[];
  refDate?: string;
  refs?: RefsTimeDto | { [key: string]: string };
  relationField?: ComponentRelationFieldDto;
  repeatableComponents?: ComponentDto[][];
  repeatAmount?: number;
  resendCodeUrl?: string;
  restrictions?: ComponentRestrictionsDto;
  russia?: boolean; // TODO: избавить от рудимента после рефактора json'ов услуг
  screenCaption?: string;
  secondaryDictionaryFilter?: ComponentDictionaryFilterDto[];
  secondScreenCaption?: string;
  selectedValue?: string;
  sendEmailLabel?: string;
  showMaskSymbols?: boolean;
  singleChild?: boolean;
  startSection?: string;
  startTime?: string;
  state?: string;
  states?: ComponentStatesDto;
  step?: number;
  style?: ConfirmUserDataStyle;
  success?: { imgSrc: string; label: string; buttons: ConfirmationModal['buttons'] };
  suggestionPath?: string;
  templateId?: string; // @see LkInvitationInputAttrs
  emptyFieldsErrorMsg?: string;
  timerRules?: TimerRulesDto;
  uploadedFile?: ComponentUploadedFileDto;
  ussr?: boolean; // TODO: избавить от рудимента после рефактора json'ов услуг
  uniqueBy?: { disclaimer?: DisclaimerDto; keys: unknown[] };
  validateMessage?: string;
  validation?: ComponentValidationDto[];
  value?: string;
  visited?: boolean;
  years?: number;
  searchProvider?: {
    dictionaryOptions: DictionaryOptions;
    dictionaryFilter: ComponentDictionaryFilterDto[];
    turnOffStartFilter?: boolean;
  };
  selectAttributes?: string[];
  LOMurlTemplate?: string;
  mapType?: string;
  electionLevel?: string;
  electionDate?: string;
  mapOptions?: KeyValueMap;
  region?: string;
  fullNameInList?: boolean;
  fullNameListAge?: ChildrenListAgeView;
  isClearable?: boolean;
  chooseChildLabel?: string;
  defaultLabelList?: string;
  defaultNewList?: string;
  listLabel?: boolean;
  limit?: number | string;
  url?: string;
  body?: string;
  method?: LogicComponentMethods;
  path?: string;
  timeout?: string;
  headers?: LogicComponentHeaders;
  customValidation?: CustomValidationDto;
  balloonAttrs?: KeyValueMap;
}

export type ChildrenListAgeView = 'date' | 'age';

export interface Hints {
  label: string;
  amount: number;
  unit: HintTimeTypes;
}

export type HintTimeTypes =
  | 'years'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'milliseconds';

export interface DisclaimerDto {
  type: DisclaimerDtoType;
  title: string;
  description: string;
  clarifications: Clarifications;
  uniquenessErrors: string[];
}

export enum DisclaimerDtoType {
  advice = 'advice',
  info = 'info',
  warn = 'warn',
  error = 'error',
}

export interface HintDto {
  type: 'warn' | 'info' | 'default';
  title: string;
  value: string;
}

export interface IMvdFilter {
  fiasList: string[];
  field: string;
  value: string[];
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
  value: string[];
  isExcludeType: boolean;
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

export interface ComponentGIBDDpaymentErrorDto {
  text: string;
  title: string;
  buttons: {
    label: string;
    closeModal: boolean;
    color?: ColorDto;
    value?: boolean;
  }[];
}

export interface ComponentStatesDto {
  [key: string]: {
    actions: ComponentActionDto[];
    body: string;
    header: string;
    subHeader: string;
    clarifications: Clarifications;
    srcImg?: string;
  };
}

export interface ComponentPresetDto {
  type: string;
  value: string;
}

export interface ComponentRelationFieldDto {
  ref: string;
  conditions: {
    type: 'RegExp' | 'MinDate' | 'MaxDate';
    value: string;
    result: {
      attrs: ComponentAttrsDto;
    };
  }[];
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
  value?: string;
  suggestionId?: string;
  attrs?: unknown;
  required?: boolean;
}

export interface DisplaySubjHead {
  text: string;
  clarifications: Clarifications;
}

export interface ActionConfirmationsDto {
  [key: string]: {
    title?: string;
    text?: string;
    buttons: {
      label: string;
      closeModal: boolean;
      color?: ColorDto;
      value?: boolean;
    }[];
    actionButtons: ComponentActionDto;
  };
}

export interface ComponentDateTimeDto {
  label: string;
  sublabel: string;
  valueType: string;
  value: string;
  required: boolean;
  hidden: boolean;
  maxDate?: string;
  minDate?: string;
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
  uploadId?: string;
  maxSize?: number;
}

export interface CustomValidationDto {
  fields?: string[];
  path?: string;
}
