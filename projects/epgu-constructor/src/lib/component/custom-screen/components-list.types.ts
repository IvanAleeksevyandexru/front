import {
  ComponentDictionaryFilterDto,
  DisplayDto,
  TextTransform,
  ComponentAttrsDto,
  DictionaryUrlTypes,
  CustomComponentRefRelation,
  RestAttrsDto,
  KeyValueMap,
  ComponentValidationDto,
} from '@epgu/epgu-constructor-types';
import { BrokenDateFixStrategy } from '@epgu/ui/models/common-enums';
import { ListItem } from '@epgu/ui/models/dropdown';
import { NumberMaskOptions } from '@epgu/epgu-constructor-ui-kit';
import { ComponentBase } from '../../screen/screen.types';
import { DateRangeRef } from '../../shared/services/date-range/date-range.models';
import {
  DictionaryItem,
  DictionaryResponse,
} from '../../shared/services/dictionary/dictionary-api.types';
import { CheckboxListElement } from './components/checkbox-list/checkbox-list.types';
import { AppLink } from './components/sign-app-link/sign-app-link.types';

export enum CustomScreenComponentTypes {
  AddressInput = 'AddressInput',
  CardNumberInput = 'CardNumberInput',
  CertificateEaisdo = 'CertificateEaisdo',
  CheckBox = 'CheckBox',
  CheckBoxList = 'CheckBoxList',
  CheckingAccount = 'CheckingAccount',
  CityInput = 'CityInput',
  ConfirmPersonalPolicyChange = 'ConfirmPersonalPolicyChange',
  ConfirmPersonalUserRegAddrChange = 'ConfirmPersonalUserRegAddrChange',
  DateInput = 'DateInput',
  CalendarInput = 'CalendarInput',
  Dictionary = 'Dictionary',
  Disclaimer = 'Disclaimer',
  DocInput = 'DocInput',
  DropDown = 'DropDown',
  DropDownDepts = 'DropDownDepts',
  EaisdoGroupCost = 'EaisdoGroupCost',
  FieldList = 'FieldList',
  FileUploadComponent = 'FileUploadComponent',
  HtmlString = 'HtmlString',
  LabelSection = 'LabelSection',
  LegalInnInput = 'LegalInnInput',
  Lookup = 'Lookup',
  MaritalStatusInput = 'MaritalStatusInput',
  MonthPicker = 'MonthPicker',
  MultipleChoiceDictionary = 'MultipleChoiceDictionary',
  ComplexChoiceDictionary = 'ComplexChoiceDictionary',
  MvdGiac = 'MvdGiac',
  NewEmailInput = 'NewEmailInput',
  NewLegalEmailInput = 'NewLegalEmailInput',
  OgrnInput = 'OgrnInput',
  OgrnipInput = 'OgrnipInput',
  PassportLookup = 'PassportLookup',
  PersonInnInput = 'PersonInnInput',
  PhoneNumberChangeInput = 'PhoneNumberChangeInput',
  RadioInput = 'RadioInput',
  RestLookup = 'RestLookup',
  SearchableDropDown = 'SearchableDropDown',
  SignAppLink = 'SignAppLink',
  SnilsInput = 'SnilsInput',
  StringInput = 'StringInput',
  TextArea = 'TextArea',
  Timer = 'Timer',
  KinderGartenDraftHandlerComponent = 'KinderGartenDraftHandler',
}

export type CustomScreenComponentValueTypes = Partial<ListItem> | Date | string | boolean;
// type CustomScreenComponentValue = {[key in CustomScreenComponentTypes]: CustomScreenComponentValueTypes };

// @todo. выяснить, почему в коде CustomListDropDowns как объект, а не массив
export type CustomListDropDowns = { [key: string]: Partial<ListItem>[] }[];
// @todo. выяснить, почему в коде CustomListDictionaries как объект, а не массив
export type CustomListDictionaries = { [key: string]: CustomListDictionary[] }[];
export type CustomListReferenceData = CustomListGenericData<
  Partial<ListItem>[] | DictionaryResponse
>;
// export type CustomComponentState = { [key: string]: CustomComponentStateItem };

export interface CustomListDictionary {
  loading: boolean;
  loadError: boolean;
  loadEnd: boolean;
  paginationLoading: boolean;
  origin?: CustomComponent;
  data: DictionaryResponse;
  list: ListItem[];
  page: number;
  selectedItem: DictionaryItem;
  repeatedWithNoFilters?: boolean;
}

export interface CustomListStatusElements {
  [key: string]: CustomStatusElement;
}

export interface CustomStatusElement {
  isShown: boolean;
  relation: CustomComponentRefRelation;
}

export interface CustomListGenericData<T> {
  component?: CustomComponent;
  data: T;
  meta?: {
    repeatedWithNoFilters: boolean;
  };
}

export type CustomComponentDropDownItemList = CustomComponentDropDownItem[];
export type CustomComponentDropDownItem = {
  title?: string;
  label?: string;
  value?: string;
  code?: string;
  disable: boolean;
};

export interface Fields extends CustomComponent {
  fieldName: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  attrs: CustomComponentAttr;
}

export type CustomComponentAttrField = {
  fieldName?: string;
  label?: string;
  type?: string;
}[];

export interface MappingParamsDto {
  idPath: string;
  textPath: string;
  isRoot?: boolean;
}

interface Relation {
  ref: string;
  conditions: RelationCondition[];
}

interface CheckBoxes {
  [id: string]: CheckboxListElement;
}

type CharsAmount = number;
type CityFilter = string[];
type Class = string;
type CurrentTime = string;
type Description = string;
type ErrorButton = string;
export type FocusOnInitAndStartSearch = boolean;
type From = string;
export type Grid = string;
type HideApartmentCheckbox = boolean;
type HideHouseCheckbox = boolean;
type HideLevels = string[];
type InterpolationEnabled = boolean;
type IsBottomSlot = boolean;
type IsHorizontal = boolean;
type IsNonStop = boolean;
type IsNotDuplicate = boolean;
type IsTextHelper = boolean;
type LabelHide = string;
type LabelShow = string;
type Limit = string;
type LocalSearch = boolean;
export type LockedValue = boolean;
export type LookupDefaultValue = string | number;
export type LookupFilterPath = string;
type ModalHeader = string;
export type NeedUnfilteredDictionaryToo = boolean;
export type OnlyFirstScreen = boolean;
type OrderId = string;
export type Placeholder = string;
type Price = number;
export type QueryMinSymbolsCount = number;
type Readonly = boolean;
export type RepeatWithNoFilters = boolean;
type Required = boolean;
type RequiredAttrs = string[];
export type SearchIconForcedShowing = boolean;
type SearchType = string;
type SelectApartmentCheckbox = boolean;
type SelectHouseCheckbox = boolean;
type ShowPlaceholderOnFocus = boolean;
type SubLabel = string;
type SuggestionId = string;
type Title = string;
type TitleHide = boolean;
type To = string;
type Type = string;
type Wait = string;
type WithAmount = boolean;

/**
 * @property ref - ссылки на связанные словари, что взять оттуда value для фильтрации текущего словаря
 * (например Регион связан со страной и чтобы не выкачивать все регионы мира, в ссылке будет указана страна)
 */
export interface CustomComponentAttr extends Partial<ComponentAttrsDto> {
  appLinks?: AppLink[];
  brokenDateFixStrategy?: BrokenDateFixStrategy;
  charsAmount?: CharsAmount;
  checkBoxes?: CheckBoxes;
  cityFilter?: CityFilter;
  class?: Class;
  currentTime?: CurrentTime;
  dateRestrictions?: DateRestriction[];
  description?: Description;
  dictionaryFilters?: ComponentDictionaryFilterDto[][];
  dictionaryList?: CustomComponentDropDownItemList;
  dictionaryUrlType?: DictionaryUrlTypes;
  errorButton?: ErrorButton;
  fields?: CustomComponentAttrField;
  focusOnInitAndStartSearch?: FocusOnInitAndStartSearch;
  from?: From;
  grid?: Grid;
  hideApartmentCheckbox?: HideApartmentCheckbox;
  hideHouseCheckbox?: HideHouseCheckbox;
  hideLevels?: HideLevels;
  interpolationEnabled?: InterpolationEnabled;
  isBottomSlot?: IsBottomSlot;
  isHorizontal?: IsHorizontal;
  isNonStop?: IsNonStop;
  isNotDuplicate?: IsNotDuplicate;
  isTextHelper?: IsTextHelper;
  labelHide?: LabelHide;
  labelShow?: LabelShow;
  limit?: Limit;
  localSearch?: LocalSearch;
  lockedValue?: LockedValue;
  lookupDefaultValue?: LookupDefaultValue;
  lookupFilterPath?: LookupFilterPath;
  mappingParams?: MappingParamsDto;
  maskOptions?: NumberMaskOptions;
  modalHeader?: ModalHeader;
  needUnfilteredDictionaryToo?: NeedUnfilteredDictionaryToo;
  onlyFirstScreen?: OnlyFirstScreen;
  orderId?: OrderId;
  placeholder?: Placeholder;
  price?: Price;
  queryMinSymbolsCount?: QueryMinSymbolsCount;
  readonly?: Readonly;
  ref?: (CustomComponentRef | DateRangeRef)[];
  refs?: KeyValueMap;
  relation?: Relation;
  repeatWithNoFilters?: RepeatWithNoFilters;
  required?: Required;
  requiredAttrs?: RequiredAttrs;
  searchIconForcedShowing?: SearchIconForcedShowing;
  searchType?: SearchType;
  secondaryDictionaryFilter?: ComponentDictionaryFilterDto[];
  selectApartmentCheckbox?: SelectApartmentCheckbox;
  selectHouseCheckbox?: SelectHouseCheckbox;
  showPlaceholderOnFocus?: ShowPlaceholderOnFocus;
  subLabel?: SubLabel;
  suggestionId?: SuggestionId;
  title?: Title;
  titleHide?: TitleHide;
  to?: To;
  type?: Type;
  updateOnValidation?: UpdateOn;
  validation?: CustomComponentAttrValidation[];
  wait?: Wait;
  withAmount?: WithAmount;
}

export interface DateRestriction {
  condition: string;
  type: 'ref' | 'const';
  value: string | Date;
  forChild?: string;
}

export type UpdateOn = 'blur' | 'change' | 'submit';

export interface CustomComponentAttrValidation extends ComponentValidationDto {
  errorDesc?: string;
  updateOn?: UpdateOn;
  expr?: string;
  forChild?: string;
}

export enum CustomComponentAttrValidator {
  validationFn = 'validation-fn',
  calculatedPredicate = 'CalculatedPredicate',
}

export interface CustomComponentOutputData {
  [key: string]: {
    value: string;
    valid: boolean;
    isValid?: boolean;
    disabled?: boolean;
    condition?: string;
  };
}

export enum CustomComponentValidationConditions {
  atLeastOne = 'atLeastOne',
}

/**
 * @property relatedRel - id компонента от которого зависим
 * @property val - ключевое значение которое должен принимать компонент от которого заивисм
 * @property relation - тип зависимости
 */
export interface CustomComponentRef {
  relatedRel: string;
  val: string | string[] | boolean;
  relation: CustomComponentRefRelation;
  sourceId?: string;
  relatedRelValues?: KeyValueMap;
  defaultValue?: string | boolean;
  valueFromCache?: string;
  dictionaryFilter?: ComponentDictionaryFilterDto[];
  isResetable?: boolean;
  path?: string;
  rest?: RestAttrsDto;
}

export interface CustomListFormGroup {
  attrs: CustomComponentAttr;
  id: string;
  label: string;
  required: boolean;
  type: CustomScreenComponentTypes;
  value: CustomScreenComponentValueTypes;
  valueFromCache?: unknown;
}

export interface CustomDisplay extends DisplayDto {
  components: CustomComponent[];
}

export interface RelationCondition {
  type: 'RegExp' | 'MinDate' | 'MaxDate';
  value: string;
  result: CustomComponentAttr;
}

export interface CustomComponentWithAttrs<T> extends ComponentBase {
  attrs: T;
  type: CustomScreenComponentTypes;
  id: string;
  hint?: string;
  fstuc?: TextTransform;
  isShown?: boolean;
  price?: boolean;
  searchProvider?: { search: Function };
}

export interface CustomComponent extends ComponentBase {
  arguments?: KeyValueMap;
  attrs: CustomComponentAttr;
  type: CustomScreenComponentTypes;
  id: string;
  hint?: string;
  fstuc?: TextTransform;
  isShown?: boolean;
  price?: boolean;
  searchProvider?: { search: Function };
}

export interface SupportedValue {
  label: string;
  value: string;
  isDefault?: boolean;
}

export interface DateRestrictionGroups {
  [key: string]: DateRestriction[];
}

export const DATE_RESTRICTION_GROUP_DEFAULT_KEY = 'defaultGroup';
export interface Searchable {
  [key: string]: { value: string | object };
}
