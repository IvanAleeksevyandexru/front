import { ListElement } from '@epgu/epgu-lib';

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
};

export const FocusListElements: ListElement[] = [
  {
    id: 'null',
    text: 'Все',
  },
  {
    id: 'socialno_gumanitarnoe',
    text: 'Социально-гуманитарная',
  },
  {
    id: 'estestvennonauchnoe',
    text: 'Естественнонаучная',
  },
  {
    id: 'hudozhestvennoe',
    text: 'Художественная',
  },
  {
    id: 'fizkulturno_sportivnoe',
    text: 'Физкультурно-спортивная',
  },
  {
    id: 'turistsko_kraevedcheskoe',
    text: 'Туристско-краеведческая',
  },
  {
    id: 'tekhnicheskoe',
    text: 'Техническая',
  },
];

export const SpecializationListElements: ListElement[] = [
  {
    id: 'null',
    text: 'Все',
  },
  {
    id: 'general',
    text: 'Общеразвивающая',
  },
  {
    id: 'preprof',
    text: 'Предпрофессиональная',
  },
  {
    id: 'sport',
    text: 'Спортивная подготовка',
  },
];

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
