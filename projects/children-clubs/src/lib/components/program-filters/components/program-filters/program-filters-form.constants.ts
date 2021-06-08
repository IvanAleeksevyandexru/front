import { ListElement } from '@epgu/epgu-lib';

export const FormFieldsName = {
  open_record: 'open_record',
  place: 'place',
  distance_program: 'distance_program',
  budget: 'budget',
  pfdod_certificate: 'pfdod_certificate',
  paid: 'paid',
  private: 'private',
  price: 'price',
  focus: 'focus',
  specialization: 'specialization',
  level: 'level',
  childAge: 'childAge',
  health: 'health',
};

export const FormFieldsLabel = {
  [FormFieldsName.open_record]: 'Показывать только программы с открытой записью',
  [FormFieldsName.place]: 'Место проведения занятий',
  [FormFieldsName.distance_program]: 'Показывать только дистанционные программы',
  [FormFieldsName.budget]: 'Бесплатно',
  [FormFieldsName.pfdod_certificate]: 'Оплата сертификатом',
  [FormFieldsName.paid]: 'Оплата из личных средств',
  [FormFieldsName.price]: 'Максимальная стоимость в месяц, ₽',
  [FormFieldsName.focus]: 'Направленность',
  [FormFieldsName.specialization]: 'Специализация',
  [FormFieldsName.level]: 'Уровень подготовки',
  [FormFieldsName.childAge]: 'Возраст ребенка, лет',
  [FormFieldsName.health]: 'Ограничения здоровья',
};

export const FocusListElements: ListElement[] = [
  {
    id: 'all',
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
    id: 'all',
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
    id: 'all',
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
