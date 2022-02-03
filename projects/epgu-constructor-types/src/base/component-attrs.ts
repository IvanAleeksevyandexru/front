import { ComponentActionDto } from './component-action-dto';
import { Clarifications } from './clarifications';
import { CustomComponentRef } from './custom-component-ref';
import type { ComponentDto } from './component-dto';
import { ComponentAnswerDto } from './qustion-component-answer';
import { ComponentDictionaryFilterDto, DictionaryOptions } from './dictionary';
import { TextTransform } from './text-transform';
import { ConfirmUserDataStyle } from './confirm-user-data';
import { TimerComponentDtoAction, TimerLabelSection } from './timer';
import { ColorDto } from './color';
import { ConfirmationModal } from '../modal';
import { KeyValueMap } from './core.types';
import type {
  LogicComponentEventTypes,
  LogicComponentHeaders,
  LogicComponentMethods,
} from './logic-component';
import { ScreenButton } from './screen-buttons';
import { CubeElements } from './checkbox';

export interface KindergartenAttrs {
  header?: string;
  label?: string;
  checkboxLabel?: string;
  finalScreenText?: string;
  listMaxLength?: number;
  nextStepLength?: number;
  attrs?: ComponentAttrsDto;
}

export enum SectionType {
  normal = 'normal',
  today = 'today',
}

export interface FieldGroup {
  groupName: string;
  visibilityLabel: string;
  fields: ComponentFieldDto[];
}

interface SearchProvider {
  dictionaryOptions: DictionaryOptions;
  dictionaryFilter: ComponentDictionaryFilterDto[];
  filterByAttributeName?: string;
  turnOffStartFilter?: boolean;
}

export interface Add {
  component: string;
  caption: string[];
}

interface Error {
  imgSrc: string;
  label: string;
  buttons: ConfirmationModal['buttons'];
}
interface Success extends Error {}
interface MuchTries extends Error {}

interface UniqueBy {
  disclaimer?: DisclaimerDto;
  keys: unknown[];
}

interface Participant {
  role: string;
  mode: string;
}

type Accuracy = string;
type AddContextQueryParams = boolean;
type ApplicantType = string;
type AttributeNameWithAddress = string;
type AutoCenterAllPoints = boolean;
type AutoMapFocus = boolean;
export type Body = string;
type CacheRepeatableFieldsAnswersLocally = boolean;
type CancelReservation = string[];
type CanDeleteFirstScreen = boolean;
type CharacterMask = string;
type CheckedParametersGIBDD = string[];
type ChooseChildLabel = string;
type CodeLength = number;
export type CustomUnrecLabel = string;
type DateType = string;
type DaysToShow = number;
export type DefaultIndex = number;
type DefaultLabelList = string;
type DefaultNewList = string;
export type DefaultValue = string;
type DictionaryGIBDD = string;
export type DictionaryType = string[] | string;
type DictItemCode = string;
export type Disabled = boolean;
type DiscountInformation = string;
type DisplayShowTimeSeconds = number;
type DownloadLink = string;
type ElectionDate = string;
type ElectionLevel = string;
type Email = string;
type EmptyFieldsErrorMsg = string;
export type EmptyWhenNoFilter = boolean;
type EquipmentFilters = unknown[];
type ExpandAllChildrenBlocks = boolean;
type ExpirationTime = string;
type Fio = string;
type FirstName = string;
type FullNameInList = boolean;
type Gender = string;
type GoNextAfterUIN = boolean;
type HelperText = string;
type Hidden = boolean;
type HideAddNewChildButton = boolean;
type HideCloneButton = boolean;
type HideSocialShare = boolean;
export type Hint = string;
type IgnoreRootParams = string[];
type ImgSrc = string;
type InfoComponents = string[];
type IsClearable = boolean;
type IsCommonDictionary = boolean;
type IsMonthsRangeVisible = boolean;
type IsMultiSelect = boolean;
type IsNeedToCheckGIBDDPayment = boolean;
type IsNeedToGroupErrors = boolean;
type IsSelectButtonHidden = boolean;
type IsSmev2 = boolean;
type IsServiceSpecific = boolean;
type IsSoloCheckBox = boolean;
type KeepVariables = boolean;
type Label = string;
type LabelHint = string;
type LastName = string;
type Limit = number | string;
type Link = string;
type ListLabel = boolean;
type LOMurlTemplate = string;
type MapType = string;
type Mask = string[];
type MaxDate = string;
type MaxDateRef = string;
type MiddleName = string;
type MinDate = string;
type MinDateRef = string;
type MiniBalloonTexts = string[];
type MinOccures = number;
type NoDepartmentsErrorMsg = string;
type NonStop = boolean;
type NotFoundItemsMessage = string;
type Nsi = string;
type Obliged = boolean;
export type Path = string;
type PayCode = number;
type PhoneNumber = number;
type PlaceholderText = string;
type PresetValue = string;
type RedirectLabel = string;
type Ref =
  | ComponentRefDto[]
  | string
  | {
      fiasCode: string;
    }
  | CustomComponentRef[];
type RefDate = string;
type Region = string;
type RepeatAmount = number;
type ResendCodeUrl = string;
type Result = object;
type ScreenCaption = string;
type SecondScreenCaption = string;
type SelectAttributes = string[];
type SelectedValue = string;
type SendEmailLabel = string;
type ShowMaskSymbols = boolean;
type SingleChild = boolean;
type StartTime = string;
type State = string;
type Step = number;
type SuggestionPath = string;
type TemplateId = string;
export type Timeout = string;
export type Url = string;
type ValidateMessage = string;
type Value = string;
type VisibleComponents = string[];
type Visited = boolean;
type WritableComponents = string[];
type Years = number;

export interface ComponentAttrsDto {
  accuracy?: Accuracy;
  actions?: ComponentActionDto[];
  add?: Add;
  addContextQueryParams?: AddContextQueryParams;
  addressString?: ComponentAddressStringDto;
  answers?: ComponentAnswerDto[];
  applicantType?: ApplicantType;
  attributeNameWithAddress?: AttributeNameWithAddress;
  autoCenterAllPoints?: AutoCenterAllPoints;
  autoMapFocus?: AutoMapFocus;
  balloonAttrs?: KeyValueMap;
  baloonContent?: ComponentBaloonContentDto[];
  beginDate?: ComponentDateTimeDto;
  beginTime?: ComponentDateTimeDto;
  body?: Body;
  bookingErrorHandling?: IBookingErrorHandling[];
  cacheRepeatableFieldsAnswersLocally?: CacheRepeatableFieldsAnswersLocally;
  cancelReservation?: CancelReservation;
  canDeleteFirstScreen?: CanDeleteFirstScreen;
  characterMask?: CharacterMask;
  checkedParametersGIBDD?: CheckedParametersGIBDD;
  chooseChildLabel?: ChooseChildLabel;
  clarifications?: Clarifications;
  codeLength?: CodeLength;
  components?: ComponentDto[];
  cropOptions?: ImageCropOptions;
  cubeElements?: CubeElements;
  customUnrecLabel?: CustomUnrecLabel;
  customValidation?: CustomValidationDto;
  customImageErrorText?: ImageErrorText;
  dateType?: DateType;
  daysToShow?: DaysToShow;
  defaultHint?: HintDto;
  defaultIndex?: DefaultIndex;
  defaultLabelList?: DefaultLabelList;
  defaultNewList?: DefaultNewList;
  defaultValue?: DefaultValue;
  dictionaryFilter?: ComponentDictionaryFilterDto[];
  dictionaryGIBDD?: DictionaryGIBDD;
  dictionaryOptions?: DictionaryOptions;
  dictionaryType?: DictionaryType;
  dictItemCode?: DictItemCode;
  disabled?: Disabled;
  disclaimer?: DisclaimerDto;
  discountInformation?: DiscountInformation;
  displayShowTimeSeconds?: DisplayShowTimeSeconds;
  downloadLink?: DownloadLink;
  electionDate?: ElectionDate;
  electionLevel?: ElectionLevel;
  email?: Email;
  emptyFieldsErrorMsg?: EmptyFieldsErrorMsg;
  emptySlotsModal?: ConfirmationModal;
  emptyWhenNoFilter?: EmptyWhenNoFilter;
  endDate?: ComponentDateTimeDto;
  endTime?: ComponentDateTimeDto;
  equipmentFilters?: EquipmentFilters;
  error?: Error;
  events?: LogicComponentEventTypes[];
  expandAllChildrenBlocks?: ExpandAllChildrenBlocks;
  expirationTime?: ExpirationTime;
  fieldGroups?: FieldGroup[];
  fields?: ComponentFieldDto[];
  filter?: ComponentFilterDto;
  fio?: Fio;
  firstName?: FirstName;
  fstuc?: TextTransform;
  fullNameInList?: FullNameInList;
  fullNameListAge?: ChildrenListAgeView;
  gender?: Gender;
  GIBDDpaymentError?: ComponentGIBDDpaymentErrorDto;
  goNextAfterUIN?: GoNextAfterUIN;
  headers?: LogicComponentHeaders;
  helperText?: HelperText;
  hidden?: Hidden;
  hideAddNewChildButton?: HideAddNewChildButton;
  hideCloneButton?: HideCloneButton;
  hideSocialShare?: HideSocialShare;
  hint?: Hint;
  hints?: Hints[];
  ignoreRootParams?: IgnoreRootParams;
  image?: ComponentImageDto;
  imgSrc?: ImgSrc;
  infoComponents?: InfoComponents;
  isClearable?: IsClearable;
  isCommonDictionary?: IsCommonDictionary;
  isMonthsRangeVisible?: IsMonthsRangeVisible;
  isMultiSelect?: IsMultiSelect;
  isNeedToCheckGIBDDPayment?: IsNeedToCheckGIBDDPayment;
  isNeedToGroupErrors?: IsNeedToGroupErrors;
  isSelectButtonHidden?: IsSelectButtonHidden;
  isSmev2?: IsSmev2;
  isServiceSpecific?: IsServiceSpecific;
  isSoloCheckBox?: IsSoloCheckBox;
  keepVariables?: KeepVariables;
  label?: Label;
  labelHint?: LabelHint;
  lastName?: LastName;
  limit?: Limit;
  link?: Link;
  listLabel?: ListLabel;
  LOMurlTemplate?: LOMurlTemplate;
  mapKindergartenPriorityAttrs?: KindergartenAttrs;
  mapOptions?: KeyValueMap;
  mapType?: MapType;
  mask?: Mask;
  maxDate?: MaxDate;
  maxDateRef?: MaxDateRef;
  method?: LogicComponentMethods;
  middleName?: MiddleName;
  minDate?: MinDate;
  minDateRef?: MinDateRef;
  miniBalloonTexts?: MiniBalloonTexts;
  minOccures?: MinOccures;
  muchTries?: MuchTries;
  mvdFilters?: IMvdFilter[]; // TODO: EPGUCORE-54425, Виктория Харитонова сказала что фильтрацию сделают на бэке. После этого нужно поле удалить это поле.
  noDepartmentsErrorMsg?: NoDepartmentsErrorMsg;
  nonStop?: NonStop;
  notFoundItemsMessage?: NotFoundItemsMessage;
  nsi?: Nsi;
  obliged?: Obliged;
  participant?: Participant;
  path?: Path;
  payCode?: PayCode;
  phoneNumber?: PhoneNumber;
  placeholderText?: PlaceholderText;
  preset?: ComponentPresetDto;
  presetValue?: PresetValue;
  redirectLabel?: RedirectLabel;
  ref?: Ref;
  refDate?: RefDate;
  refs?: RefsTimeDto | KeyValueMap;
  region?: Region;
  relationField?: ComponentRelationFieldDto;
  repeatableComponents?: ComponentDto[][];
  repeatAmount?: RepeatAmount;
  resendCodeUrl?: ResendCodeUrl;
  restrictions?: ComponentRestrictionsDto;
  result?: Result;
  russia?: boolean; // TODO: избавить от рудимента после рефактора json'ов услуг
  screenCaption?: ScreenCaption;
  searchPanel?: ComponentDto;
  searchProvider?: SearchProvider;
  secondaryDictionaryFilter?: ComponentDictionaryFilterDto[];
  secondScreenCaption?: SecondScreenCaption;
  selectAttributes?: SelectAttributes;
  selectedValue?: SelectedValue;
  sendEmailLabel?: SendEmailLabel;
  showMaskSymbols?: ShowMaskSymbols;
  singleChild?: SingleChild;
  slotsNotFoundTemplate?: SlotsNotFoundTemplate;
  startSection?: SectionType;
  startTime?: StartTime;
  state?: State;
  states?: ComponentStatesDto;
  step?: Step;
  style?: ConfirmUserDataStyle;
  success?: Success;
  suggestionPath?: SuggestionPath;
  supportedValues?: SupportedValue[];
  templateId?: TemplateId; // @see InvitationAttrs
  timeout?: Timeout;
  timerRules?: TimerRulesDto;
  uniqueBy?: UniqueBy;
  uploadedFile?: ComponentUploadedFileDto;
  url?: Url;
  ussr?: boolean; // TODO: избавить от рудимента после рефактора json'ов услуг
  validateMessage?: ValidateMessage;
  validation?: ComponentValidationDto[];
  value?: Value;
  visibleComponents?: VisibleComponents;
  visited?: Visited;
  writableComponents?: WritableComponents;
  years?: Years;
}

export interface SlotsNotFoundTemplate {
  header: string;
  description: string;
  checkboxLabel: string;
  button: ScreenButton;
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
  level: DisclaimerDtoLevel;
  mnemonic: DisclaimerMnemonic;
  message?: string;
  id?: number;
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

export enum DisclaimerDtoLevel {
  info = 'INFO',
  warn = 'WARN',
  error = 'ERROR',
}

export enum DisclaimerMnemonic {
  SERVICE_TARGET = 'SERVICE_TARGET',
  EPGU_V3_SERVICE_TARGET = 'EPGU_V3_SERVICE_TARGET',
  EPGU_V3_SERVICE_TARGET_DESKTOP = 'EPGU_V3_SERVICE_TARGET_DESKTOP',
  EPGU_V3_SERVICE_TARGET_MOBILE = 'EPGU_V3_SERVICE_TARGET_MOBILE',
  SMU_SERVICE_TARGET = 'SMU_SERVICE_TARGET',
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

export interface RelationCondition {
  type: 'RegExp' | 'MinDate' | 'MaxDate';
  value: string;
  result: {
    attrs: ComponentAttrsDto;
  };
}
export interface ComponentRelationFieldDto {
  ref: string;
  conditions: RelationCondition[];
}

export interface ComponentValidationDto {
  type: string;
  value: string;
  ref: string;
  dataType: string;
  condition: string;
  errorMsg: string;
  forChild?: string;
}

export interface ComponentRefDto {
  relatedDate: string;
  val: string;
  period: string;
  condition: string;
}

export interface ComponentFieldDto {
  attrs?: unknown;
  errorMsg?: string;
  fieldName?: string;
  label?: string;
  mask?: string[];
  regexp?: string | RegExp;
  required?: boolean;
  suggestionId?: string;
  type?: string;
  value?: string;
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

export interface IBookingErrorHandling {
  errorCode: string;
  errorMessageRegExp?: string;
  modalAttributes: ConfirmationModal;
}

export interface SupportedValue {
  label: string;
  value: string;
  isDefault?: boolean;
}

interface ImageErrorText {
  [errorType: string]: {
    title: string;
    text: string;
    textRules: string;
  };
}

export enum CropTypes {
  FACE = 'face',
  A1TO1 = '1:1',
  A3TO4 = '3:4',
}

export interface ImageCropOptions {
  cropType: CropTypes;
}
