import { Clarifications } from '@epgu/epgu-constructor-types';

export interface NSIDictionaryItem {
  code: string;
  name: string;
}

export interface BaseProgram {
  name: string;
  partnerName: string;
  address: string;
  imageUrl: string;
  imageSmallUrl: string;
  minAge: number;
  maxAge: number;
  financingSources: NSIDictionaryItem[];
  programRegistries: NSIDictionaryItem[];
}

export interface Program extends BaseProgram {
  fullName: string;
  announce: string;
  teachers: string;
  maxPersons: number;
  programContent: string;
  goal: string;
  results: string;
  technicalBase: string;
}

export interface Project {
  projectId: number;
  name: string;
  description: string;
  organization: string;
  image: string;
  address: string;
  ageLimit: string;
  freeTrainingPossible?: string;
  paidTrainingPossible?: string;
  PaymentByCertificatePossible?: string;
  groupSize?: string;
  teacher?: string;
  schedule?: string;
  period?: string;
  budgetProgramOther?: string;
  budgetProgramPreProf?: string;
  budgetProgramSignificant?: string;
  distanceLearning: string;
  additional?: string;
  clarifications?: Clarifications;
}

export interface FinancialSource {
  sourceCode: string;
  cost: number;
}

export interface Group {
  name: string;
  ageFrom: number; //float
  ageTo: number; //float
  size: string; //byte
  dateBegin: string; //date
  dateEnd: string; //date
  hoursYear: number; //float
  costHourManual: string;
  teachers: string;
  schedule: string;
  financingSources: FinancialSource[];
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

type FocusFilter =
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
  query: string; //Поисковый запрос по параметрам: адрес проведения занятий, ФИО педагога, название группы
  isRegistrationOpen: boolean; //Показывать только программы с открытой записью
  place: string; //Место проведения занятий
  onlyDistanceProgram: boolean; //Показывать только дистанционные программы
  inlernoPayments: InlernoPaymentFilters;
  pfdoPayments: PfdoPaymentFilters;
  maxPrice: number; //Максимальная стоимость в месяц
  focus: FocusFilter; //Направленность
  direction: string; //Специализация
  level: LevelType; //Уровень подготовки
  age: number; //Возраст ребенка, лет
  ovzType: OvzType; //Ограничения здоровья
}

//Параметры для фильтрации групп
export interface FindOptionsGroup {
  isRegistrationOpen: boolean; //Показывать только группы с открытой записью
  inlernoPayments: InlernoPaymentFilters;
  pfdoPayments: PfdoPaymentFilters;
  maxPrice: number; //int64 - Максимальная стоимость в месяц
  level: LevelType; //Уровень подготовки
  age: number; //int32 - Возраст ребенка, лет
}

// Ответ на запрос доступных групп программы
export interface FindResponseGroup {
  items: Group[];
}

//Параметры для фильтрации программ
export interface FindOptionsProgram {
  filters: Filters;
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
  focus: string;
  directions: string[];
}

export interface DirectionsResponse {
  items: FocusDirectionsItem[];
}
