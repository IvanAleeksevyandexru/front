import { ListElement } from '@epgu/epgu-lib';
import { InlernoPaymentFilters, PfdoPaymentFilters } from '../../typings';

export const FormFieldsName = {
  isRegistrationOpen: 'isRegistrationOpen',
  place: 'place',
  onlyDistanceProgram: 'onlyDistanceProgram',
  free: 'free',
  certificate: 'certificate',
  personalFunds: 'personalFunds',
  private: 'private',
  maxPrice: 'maxPrice',
  focus: 'focus',
  direction: 'direction',
  level: 'level',
  age: 'age',
  ovzType: 'ovzType',
  preprof: 'preprof',
  valued: 'valued',
  other: 'other',
};

export const defaultPdfoFilters = {
  valued: false,
  preprof: false,
  other: false,
  certificate: false,
  personalFunds: false,
};

export const defaultInlearnoFilters = {
  free: false,
  certificate: false,
  personalFunds: false,
};

export const FormFieldsLabel = {
  [FormFieldsName.isRegistrationOpen]: 'Показывать только программы с открытой записью',
  [FormFieldsName.place]: 'Место проведения занятий',
  [FormFieldsName.onlyDistanceProgram]: 'Показывать только дистанционные программы',
  [FormFieldsName.free]: 'Бесплатно',
  [FormFieldsName.certificate]: 'Оплата сертификатом',
  [FormFieldsName.personalFunds]: 'Оплата из личных средств',
  [FormFieldsName.maxPrice]: 'Максимальная стоимость в месяц, ₽',
  [FormFieldsName.focus]: 'Направленность',
  [FormFieldsName.direction]: 'Специализация',
  [FormFieldsName.level]: 'Уровень подготовки',
  [FormFieldsName.age]: 'Возраст ребенка, лет',
  [FormFieldsName.ovzType]: 'Ограничения здоровья',
  [FormFieldsName.preprof]: 'Бесплатно (предпрофессиональные)',
  [FormFieldsName.valued]: 'Бесплатно (значимые)',
  [FormFieldsName.other]: 'Бесплатно (иные программы)',
};

export const LevelListElements: ListElement[] = [
  {
    id: 'null',
    text: 'Все',
  },
  {
    id: 'initial',
    text: 'Начинающий (ознакомительный)',
  },
  {
    id: 'basic',
    text: 'Базовый',
  },
  {
    id: 'advanced',
    text: 'Продвинутый (углубленный)',
  },
];

export const HealthListElements: ListElement[] = [
  {
    id: 'all',
    text: 'Все',
  },
  {
    id: 'deafness',
    text: 'Глухие',
  },
  {
    id: 'hearing_impairment',
    text: 'Слабослышащие и позднооглохшие',
  },
  {
    id: 'blindness',
    text: 'Слепые',
  },
  {
    id: 'visual_impairment',
    text: 'Слабовидящие',
  },
  {
    id: 'speech_impairment',
    text: 'Нарушение речи',
  },
  {
    id: 'musculoskeletal_disorders',
    text: 'Нарушение опорно-двигательного аппарата',
  },
  {
    id: 'mental_impairment',
    text: 'Задержка психического развития',
  },
  {
    id: 'authism',
    text: 'Расстройство аутического спектра',
  },
  {
    id: 'intellectual_disability',
    text: 'Нарушение интеллекта',
  },
];

export interface FormValue {
  isRegistrationOpen: boolean;
  place: string;
  onlyDistanceProgram: boolean;
  inlernoPayments?: InlernoPaymentFilters;
  pfdoPayments?: PfdoPaymentFilters;
  maxPrice: string;
  focus: ListElement;
  direction: ListElement;
  level: ListElement;
  age: string;
  ovzType: ListElement;
}
