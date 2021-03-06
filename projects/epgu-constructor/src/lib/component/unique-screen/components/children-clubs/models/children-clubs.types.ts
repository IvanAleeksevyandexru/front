import { ListElement } from '@epgu/ui/models/dropdown';

export enum VendorType {
  inlearno = 'inlearno',
  pfdo = 'pfdo',
}

export enum FinancingType {
  free = 'free',
  other = 'other',
  preprof = 'preprof',
  valued = 'valued',
  paid = 'paid',
  certificate = 'certificate',
}

export const financingTypes: Record<string, { icon: string; text: string }> = {
  free: { icon: 'not-paid.svg', text: 'Возможно бесплатное обучение' },
  other: { icon: 'budget-other.svg', text: 'Бюджетная программа (иная образовательная)' },
  preprof: { icon: 'budget-pre-prof.svg', text: 'Бюджетная программа (предпрофессиональная)' },
  valued: { icon: 'budget-sign.svg', text: 'Бюджетная программа (значимая)' },
  paid: { icon: 'paid.svg', text: 'Возможно платное обучение' },
  certificate: { icon: 'cert.svg', text: 'Возможна оплата сертификатом' },
};

export interface BaseProgram {
  uuid: string;
  name: string;
  partnerName: string;
  partnerPhone: string;
  address: string;
  imageUrl: string;
  imageSmallUrl: string;
  minAge: number;
  maxAge: number;
  available: boolean;
  financingTypes: FinancingType[];
}

export enum EducationType {
  distance = 'distance',
}

export enum TypeOfBudget {
  preprof = 'preprof',
  valued = 'valued',
  other = 'other',
}
export interface Region {
  uuid: string;
  name: string;
}
export interface Program extends BaseProgram {
  fullName: string;
  announce: string;
  teachers: string;
  maxPersons: number;
  programContent: string;
  partnerPhone: string;
  goals: string;
  results: string;
  technicalBase: string;
  detailDescription: string;
  educationForm: EducationType | string;
  groupCount: number;
  availableGroupCount: number;
  typeOfBudget: TypeOfBudget;
  datasource: string;
  region: Region;
  municipal: Municipality;
  pfdodRulesLink: string;
  site: string;
}

export enum FinancialSourceType {
  none = 'none',
  budget = 'budget',
  pfdod_certificate = 'pfdod_certificate',
  paid = 'paid',
  private = 'private',
}

export enum DenyReason {
  RegistrationClosed = 'registration_closed',
  NoTimetable = 'no_timetable',
  RegistrationNotStarted = 'registration_not_started',
  RegistrationFinished = 'registration_finished',
  ModuleFinished = 'module_finished',
}

export interface FinancialSource {
  sourceCode: FinancialSourceType;
  cost: number;
  monthlyCost: number;
}

export interface Group {
  uuid: string;
  name: string;
  available: boolean;
  ageFrom: number; // float
  ageTo: number; // float
  size: string; // byte
  dateBegin: string | null; // date
  dateEnd: string | null; // date
  hoursYear: number; // float
  teachers: string;
  schedule: string;
  financingSources: FinancialSource[];
  orderFrom: string | null;
  orderTo: string | null;
  availableNextYearOrderFrom: string | null;
  availableNextYearOrderTo: string | null;
  denyReason: DenyReason | null;
}

export enum OvzType {
  deafness = 'deafness',
  hearing_impairment = 'hearing_impairment',
  blindness = 'blindness',
  visual_impairment = 'visual_impairment',
  speech_impairment = 'speech_impairment',
  mental_impairment = 'mental_impairment',
  authism = 'authism',
  intellectual_disability = 'intellectual_disability',
}
export enum LevelType {
  initial = 'initial',
  basic = 'basic',
  advanced = 'advanced',
}

export type FocusFilter =
  | 'socialno-pedagogicheskoe'
  | 'estestvennonauchnoe'
  | 'hudozhestvennoe'
  | 'fizkulturno-sportivnoe'
  | 'turistsko-kraevedcheskoe'
  | 'tekhnicheskoe';

// Форма оплаты для Инлерно
export interface InlernoPaymentFilters {
  free: boolean; // Бесплатно
  certificate: boolean; // Оплата сертификатом
  personalFunds: boolean; // Оплата из личных средств
}

// Форма оплаты для ПФДО
export interface PfdoPaymentFilters {
  preprof: boolean; // Бесплатно (предпрофессиональные)
  valued: boolean; // Бесплатно (значимые)
  other: boolean; // Бесплатно (иные программы)
  certificate: boolean; // Оплата сертификатом
  personalFunds: boolean; // Оплата из наличных средств
}

export interface Filters {
  query?: string; // Поисковый запрос по параметрам: адрес проведения занятий, ФИО педагога, название группы
  isRegistrationOpen?: boolean; // Показывать только программы с открытой записью
  municipality?: ListElement | string; // Место проведения занятий
  onlyDistanceProgram?: boolean; // Показывать только дистанционные программы
  inlearnoPayments?: InlernoPaymentFilters;
  pfdoPayments?: PfdoPaymentFilters;
  maxPrice?: number; // Максимальная стоимость в месяц
  focus?: ListElement | FocusFilter; // Направленность
  direction?: ListElement | string; // Специализация
  level?: LevelType; // Уровень подготовки
  age?: number; // Возраст ребенка, лет
  ovzType?: OvzType; // Ограничения здоровья
}

// Параметры для фильтрации групп
export interface FindOptionsGroup {
  query?: string;
  nextSchoolYear?: boolean;
  vendor?: VendorType;
  isRegistrationOpen?: boolean; // Показывать только группы с открытой записью
  inlearnoPayments?: InlernoPaymentFilters;
  pfdoPayments?: PfdoPaymentFilters;
  maxPrice?: number; // int64 - Максимальная стоимость в месяц
  age?: number; // int32 - Возраст ребенка, лет
}

// Ответ на запрос доступных групп программы
export interface FindResponseGroup {
  items: Group[];
}

// Параметры для фильтрации программ
export interface FindOptionsProgram {
  filters: Filters;
  nextSchoolYear: boolean; // Следующий учебный год (с 1 сентября), выбирается после региона
  vendor: VendorType; // Вендор выбранного региона, со значениями "inlearno" или "pfdo"
  okato: string; // ОКАТО региона, в котором ищутся программы. Обязательное поле.
  page: number; // Номера страницы, начиная с 0. По умолчанию 0
  pageSize: number; // Размер страницы
}

// Ответ на запрос программ
export interface FindResponseProgram {
  page: number; // номер текущей страницы
  pageSize: number; // размер страницы
  items: BaseProgram[];
}

export interface FocusDirectionsItem {
  focusName: string;
  focusCode: string;
  directions: string[];
}

export interface NormalizedFocusData {
  focus: ListElement[];
  directions: Record<string, ListElement[]>;
}

export interface Municipality {
  uuid: string;
  name: string;
}

export interface MunicipalityResponse {
  items: Municipality[];
}
export interface DirectionsResponse {
  items: FocusDirectionsItem[];
}

export interface ChildrenClubsValue {
  datasource: string;
  program: ValueProgram;
  group: ValueGroup;
}

export interface ChildrenClubsState {
  addressString?: string;
  denyReason: string;
  groupFilters?: FindOptionsGroup;
  groupFiltersMode: GroupFiltersModes;
  isLoaderVisible: boolean;
  mapOptions?: string;
  nextSchoolYear: string;
  okato: string;
  pageSize: number;
  programFilters?: Filters;
  selectedProgramUUID?: string;
  vendor: VendorType;
}

export interface ValueProgram {
  name: string;
  fiasMunicipal: string;
  municipalityName: string;
  fiasRegion: string;
  regionName: string;
  typeOfBudget: string;
  partnerPhone: string;
  pfdodRulesLink: string;
  site: string;
}

export interface ValueGroup {
  groupGUID: string;
  name: string;
  dateBegin: string;
  dateEnd: string;
  financialSource: Record<string, boolean>;
  financialSourceBudget: Record<string, number>;
  orderFrom: string;
  orderTo: string;
  availableNextYearOrderFrom: string;
  availableNextYearOrderTo: string;
}

export enum GroupFiltersModes {
  map = 'map',
  list = 'list',
}

export interface DenyReasonMessage {
  title: string;
  text: string;
}
