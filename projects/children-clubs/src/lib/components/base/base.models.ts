import { ListElement } from '@epgu/epgu-lib';

export const FormFieldsName = {
  isRegistrationOpen: 'isRegistrationOpen',
  municipality: 'municipality',
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
  [FormFieldsName.municipality]: 'Место проведения занятий',
  [FormFieldsName.onlyDistanceProgram]: 'Показывать только дистанционные программы',
  [FormFieldsName.free]: 'Бесплатно',
  [FormFieldsName.certificate]: 'Сертификатом',
  [FormFieldsName.personalFunds]: 'Из личных средств',
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
    id: null,
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

export const aboutPayment = {
  title: 'Подробнее о способах оплаты',
  text:
    // eslint-disable-next-line max-len
    '<h5 class="mb-8">Оплата зависит от типа программы</h5><ul class="mb-24"><li class="mb-24"><b>Бесплатная</b> — оплата не потребуется. Муниципалитет устанавливает количество таких программ на ребёнка в год</li><li class="mb-24"><b>Сертифицированная</b> — обучение оплачиваетсяиз средств на сертификате, ноне всегда полностью. Часть обучения может оплачиватьсяиз личных средств, если денег на сертификате недостаточно или стоимость кружка выше максимальной суммы, установленной муниципалитетом</li><li><b>Платная</b> — обучение оплачивается из личных средств полностью</li></ul><p class="mt-24"><a href="about:blank">О дополнительном образованиии и персонифицированном финансировании</a></p>',
};

export const HealthListElements: ListElement[] = [
  {
    id: null,
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
