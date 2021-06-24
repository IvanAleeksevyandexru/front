import { ListElement } from '@epgu/epgu-lib';

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

export interface NSIDictionaryItem {
  code: string;
  name: string;
}

export interface BaseProgram {
  uuid: string;
  name: string;
  partnerName: string;
  address: string;
  imageUrl: string;
  imageSmallUrl: string;
  minAge: number;
  maxAge: number;
  financingTypes: FinancingType[];
}

export enum EducationType {
  distance = 'distance',
}

export interface Program extends BaseProgram {
  fullName: string;
  announce: string;
  teachers: string;
  maxPersons: number;
  programContent: string;
  goals: string;
  results: string;
  technicalBase: string;
  educationForm: EducationType | string;
  groupCount: number;
}

export interface FinancialSource {
  sourceCode: string;
  cost: number;
  monthlyCost: number;
}

export interface Group {
  uuid: string;
  name: string;
  ageFrom: number; //float
  ageTo: number; //float
  size: string; //byte
  dateBegin: string; //date
  dateEnd: string; //date
  hoursYear: number; //float
  teachers: string;
  schedule: string;
  financingTypes: FinancingType[];
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

//Форма оплаты для Инлерно
export interface InlernoPaymentFilters {
  free: boolean; //Бесплатно
  certificate: boolean; //Оплата сертификатом
  personalFunds: boolean; //Оплата из личных средств
}

// Форма оплаты для ПФДО
export interface PfdoPaymentFilters {
  preprof: boolean; //Бесплатно (предпрофессиональные)
  valued: boolean; //Бесплатно (значимые)
  other: boolean; //Бесплатно (иные программы)
  certificate: boolean; //Оплата сертификатом
  personalFunds: boolean; //Оплата из наличных средств
}

export interface Filters {
  query?: string; //Поисковый запрос по параметрам: адрес проведения занятий, ФИО педагога, название группы
  isRegistrationOpen?: boolean; //Показывать только программы с открытой записью
  place?: ListElement | string; //Место проведения занятий
  onlyDistanceProgram?: boolean; //Показывать только дистанционные программы
  inlernoPayments?: InlernoPaymentFilters;
  pfdoPayments?: PfdoPaymentFilters;
  maxPrice?: number; //Максимальная стоимость в месяц
  focus?: ListElement | FocusFilter; //Направленность
  direction?: ListElement | string; //Специализация
  level?: LevelType; //Уровень подготовки
  age?: number; //Возраст ребенка, лет
  ovzType?: OvzType; //Ограничения здоровья
}

//Параметры для фильтрации групп
export interface FindOptionsGroup {
  nextSchoolYear: boolean;
  vendor: VendorType;
  isRegistrationOpen?: boolean; //Показывать только группы с открытой записью
  inlernoPayments?: InlernoPaymentFilters;
  pfdoPayments?: PfdoPaymentFilters;
  maxPrice?: number; //int64 - Максимальная стоимость в месяц
  level?: LevelType; //Уровень подготовки
  age?: number; //int32 - Возраст ребенка, лет
}

// Ответ на запрос доступных групп программы
export interface FindResponseGroup {
  items: Group[];
}

//Параметры для фильтрации программ
export interface FindOptionsProgram {
  filters: Filters;
  nextSchoolYear: boolean; //Следующий учебный год (с 1 сентября), выбирается после региона
  vendor: VendorType; //Вендор выбранного региона, со значениями "inlearno" или "pfdo"
  okato: number; //ОКАТО региона, в котором ищутся программы. Обязательное поле.
  page: number; //Номера страницы, начиная с 0. По умолчанию 0
  pageSize: number; // Размер страницы
}

//Ответ на запрос программ
export interface FindResponseProgram {
  page: number; //номер текущей страницы
  pageSize: number; //размер страницы
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
export interface DirectionsResponse {
  items: FocusDirectionsItem[];
}
