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
import { ScreenButton } from './screen-buttons';

export interface KinderGardenAttrs {
  header?: string;
  label?: string;
  checkboxLabel?: string;
  buttons?: Array<ScreenButton>;
  attrs?: ComponentAttrsDto;
}

export interface ComponentAttrsDto {
  accuracy?: string;
  actions?: Array<ComponentActionDto>;
  add?: { component: string; caption: string[] };
  addContextQueryParams?: boolean;
  addressString?: ComponentAddressStringDto;
  answers?: Array<ComponentAnswerDto>;
  applicantType?: string;
  attributeNameWithAddress?: string;
  autoCenterAllPoints?: boolean;
  autoMapFocus?: boolean;
  baloonContent?: Array<ComponentBaloonContentDto>;
  beginDate?: ComponentDateTimeDto;
  beginTime?: ComponentDateTimeDto;
  cacheRepeatableFieldsAnswersLocally?: boolean;
  cancelReservation?: string[];
  canDeleteFirstScreen?: boolean;
  characterMask?: string;
  checkedParametersGIBDD?: Array<string>;
  clarifications?: Clarifications;
  codeLength?: number;
  components?: Array<ComponentDto>;
  customUnrecLabel?: string;
  dateType?: string;
  daysToShow?: number;
  defaultIndex?: number;
  defaultValue?: boolean;
  dictionaryFilter?: Array<ComponentDictionaryFilterDto>;
  dictionaryGIBDD?: string;
  dictionaryOptions?: DictionaryOptions;
  dictionaryType?: Array<string> | string;
  dictItemCode?: string;
  disabled?: boolean;
  disclaimer?: DisclaimerDto;
  displayShowTimeSeconds?: number;
  downloadLink?: string; // ссылка для скачивания файлов в empty screen
  emptySlotsModal?: ConfirmationModal;
  endDate?: ComponentDateTimeDto;
  endTime?: ComponentDateTimeDto;
  error?: { imgSrc: string; label: string; buttons: ConfirmationModal['buttons'] };
  expandAllChildrenBlocks?: boolean;
  expirationTime?: string;
  fields?: Array<ComponentFieldDto>;
  fieldGroups?: { groupName: string; visibilityLabel: string; fields: Array<ComponentFieldDto> };
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
  ignoreRootParams?: Array<string>;
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
  mapKinderGardenPriorityAttrs?: KinderGardenAttrs;
  mask?: Array<string>;
  maxDate?: string;
  maxDateRef?: string;
  middleName?: string;
  minDate?: string;
  minDateRef?: string;
  minOccures?: number;
  muchTries?: { imgSrc: string; label: string; buttons: ConfirmationModal['buttons'] };
  mvdFilters?: Array<IMvdFilter>; // TODO: EPGUCORE-54425, Виктория Харитонова сказала что фильтрацию сделают на бэке. После этого нужно поле удалить это поле.
  noDepartmentsErrorMsg?: string;
  nonStop?: boolean;
  nsi?: string;
  payCode?: number;
  phoneNumber?: number;
  placeholderText?: string;
  preset?: ComponentPresetDto;
  redirectLabel?: string;
  ref?: Array<ComponentRefDto> | string | { fiasCode: string } | Array<CustomComponentRef>;
  refDate?: string;
  refs?: RefsTimeDto | { [key: string]: string };
  relationField?: ComponentRelationFieldDto;
  repeatableComponents?: Array<Array<ComponentDto>>;
  repeatAmount?: number;
  resendCodeUrl?: string;
  restrictions?: ComponentRestrictionsDto;
  russia?: boolean;
  screenCaption?: string;
  secondaryDictionaryFilter?: Array<ComponentDictionaryFilterDto>;
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
  templateId?: string; // @see LkInvitationInputAttrs
  timerRules?: TimerRulesDto;
  uploadedFile?: ComponentUploadedFileDto;
  ussr?: boolean;
  validateMessage?: string;
  validation?: Array<ComponentValidationDto>;
  value?: string;
  visited?: boolean;
  years?: number;
}

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
  type: 'warn' | 'error';
  title: string;
  description: string;
}

export interface IMvdFilter {
  fiasList: Array<string>;
  field: string;
  value: Array<string>;
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
  buttons: Array<{
    label: string;
    closeModal: boolean;
    color?: ColorDto;
    value?: boolean;
  }>;
}

export interface ComponentStatesDto {
  [key: string]: {
    actions: Array<ComponentActionDto>;
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
  value?: string;
  suggestionId?: string;
}

export interface DisplaySubjHead {
  text: string;
  clarifications: Clarifications;
}

export interface ActionConfirmationsDto {
  [key: string]: {
    title?: string;
    text?: string;
    submitLabel?: string;
    buttons: Array<{
      label: string;
      closeModal: boolean;
      color?: ColorDto;
      value?: boolean;
    }>;
    actionButtons: ComponentActionDto;
  };
}

export interface ComponentDateTimeDto {
  label: string;
  valueType: string;
  value: string;
  required: boolean;
  hidden: boolean;
  maxDate?: string;
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
