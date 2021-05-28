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

export interface ComponentAttrsDto {
  actions?: Array<ComponentActionDto>;
  answers?: Array<ComponentAnswerDto>;
  clarifications?: Clarifications;
  fields?: Array<ComponentFieldDto>;
  dictionaryType?: Array<string> | string;
  ref?: Array<ComponentRefDto> | string | { fiasCode: string } | Array<CustomComponentRef>;
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
  characterMask?: string;
  codeLength?: number;
  resendCodeUrl?: string;
  isNeedToCheckGIBDDPayment?: boolean;
  dictionaryGIBDD?: string;
  checkedParametersGIBDD?: Array<string>;
  GIBDDpaymentError?: ComponentGIBDDpaymentErrorDto;
  attributeNameWithAddress?: string;
  dictionaryFilter?: Array<ComponentDictionaryFilterDto>;
  secondaryDictionaryFilter?: Array<ComponentDictionaryFilterDto>;
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
  customUnrecLabel?: string;
  hint?: string;
  russia?: boolean;
  ussr?: boolean;
  accuracy?: string;
  disabled?: boolean;
  hidden?: boolean;
  defaultValue?: boolean;
  filter?: ComponentFilterDto;
  defaultIndex?: number;
  startTime?: string;
  expirationTime?: string;
  timerRules?: TimerRulesDto;
  refs?: RefsTimeDto | { [key: string]: string };
  autoMapFocus?: boolean;
  autoCenterAllPoints?: boolean;
  selectedValue?: string;
  fstuc?: TextTransform;
  payCode?: number;
  goNextAfterUIN?: boolean;
  nsi?: string;
  dictItemCode?: string;
  uploadedFile?: ComponentUploadedFileDto;
  validateMessage?: string;
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
  add?: { component: string; caption: string[] };
  hideAddNewChildButton?: boolean;
  dateType?: string;
  refDate?: string;
  noDepartmentsErrorMsg?: string;
  showMaskSymbols?: boolean;
  step?: number;
  beginDate?: ComponentDateTimeDto;
  endDate?: ComponentDateTimeDto;
  beginTime?: ComponentDateTimeDto;
  endTime?: ComponentDateTimeDto;
  canDeleteFirstScreen?: boolean;
  emptySlotsModal?: ConfirmationModal;
  fio?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  cancelReservation?: string[];
  minOccures?: number;
  displayShowTimeSeconds?: number;
  phoneNumber?: number;
  mvdFilters?: Array<IMvdFilter>; // TODO: EPGUCORE-54425, Виктория Харитонова сказала что фильтрацию сделают на бэке. После этого нужно поле удалить это поле.
  downloadLink?: string; // ссылка для скачивания файлов в empty screen
  templateId?: string; // @see LkInvitationInputAttrs
  daysToShow?: number;
  startSection?: string;
  isMonthsRangeVisible?: boolean;
  isSelectButtonHidden?: boolean;
  expandAllChildrenBlocks?: boolean;
  disclaimer?: DisclaimerDto;
}

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
