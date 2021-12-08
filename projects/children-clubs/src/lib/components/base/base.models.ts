import { ListElement } from '@epgu/ui/models/dropdown';

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
  [FormFieldsName.municipality]: 'Муниципалитет',
  [FormFieldsName.onlyDistanceProgram]: 'Показывать только дистанционные программы',
  [FormFieldsName.free]: 'Бесплатно',
  [FormFieldsName.certificate]: 'Сертификатом',
  [FormFieldsName.personalFunds]: 'Из личных средств',
  [FormFieldsName.maxPrice]: 'Максимальная стоимость в месяц, ₽',
  [FormFieldsName.focus]: 'Направленность',
  [FormFieldsName.direction]: 'Специализация',
  [FormFieldsName.level]: 'Уровень подготовки',
  [FormFieldsName.age]: 'Возраст ребёнка, лет',
  [FormFieldsName.ovzType]: 'Ограничения здоровья',
  [FormFieldsName.preprof]: 'Бесплатно (предпрофессиональные)',
  [FormFieldsName.valued]: 'Бесплатно (значимые)',
  [FormFieldsName.other]: 'Бесплатно (иные программы)',
};

export const LevelListElements: ListElement[] = [
  {
    id: 'empty-item',
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

const aboutPaymentClarifications = {
   whatIsCertificate: {
     title: 'Что такое сертификат персонифицированного финансирования',
     // eslint-disable-next-line max-len
     text: '<h5 class=\'mb-12\'>Что такое сертификат ПФДО</h5><p class=\'mt-12 mb-24\'>Электронный сертификат персонифицированного финансирования дополнительного образования (ПФДО) — это способ оплаты кружков и секций для детей от 5 до 17 лет включительно<br />С помощью сертификатов родители определяют, куда пойдут средства бюджета. Востребованные кружки получат больше денег, и это поможет им развиваться<br />Некоторые частные кружки переходят на оплату сертификатами. У родителей появляется возможность отдать детей учиться за счёт бюджета на платные программы</p><h5 class=\'mb-12\'>Как работает сертификат ПФДО</h5><p class=\'mt-12 mb-24\'>Сертификат для ребёнка выпускает муниципалитет. Каждое учебное полугодие или раз в год он зачисляет на него деньги, которые родители могут потратить на оплату кружков и секций по своему выбору<br />Для каждого ребёнка сертификат выпускают один раз, а в последующем только пополняют. Сроки пополнения сертификата могут отличаться в разных муниципалитетах, но обычно это происходит автоматически в январе на целый год<br />Например, ребёнок ходит в кружок, программа которого рассчитана на период с сентября по апрель. Сертификат в январе пополнится деньгами на период с января по декабрь<br />Сумма, на которую государство пополняет сертификат ежегодно, различается. В одном муниципалитете это может быть 2000 ₽, в другом — 15 000 ₽ и больше<br />При записи в кружок с оплатой сертификатом на Госуслугах вы увидите баланс сертификата и детали оплаты. Если денег на сертификате будет не хватать, разницу можно доплатить из личных средств в самом кружке<br />Обратите внимание, что сертификаты пополняются деньгами сразу на год. Рассчитывайте бюджет так, чтобы потратить деньги в период январь — май, но и оставить нужную сумму на период с сентября по декабрь</p><h5 class=\'mb-12\'>Как получить сертификат</h5><p class=\'mt-12 mb-24\'>Выберите понравившийся кружок на Госуслугах. Если он потребует оплату сертификатом, Госуслуги автоматически выдадут сертификат нужного муниципалитета <br />Если у вашего ребёнка уже есть сертификат, вы можете воспользоваться им на Госуслугах</p>'
   }
};

export const aboutPayment = {
  title: 'Подробнее о способах оплаты',
  text:
    // eslint-disable-next-line max-len
    '<h5 class="mb-8">Оплата зависит от типа программы</h5><ul class="mb-24"><li class="mb-24"><b>Бесплатная</b> — оплата не потребуется. Муниципалитет устанавливает количество таких программ на ребёнка в год</li><li class="mb-24"><b>Сертифицированная</b> — обучение оплачивается из средств на сертификате, но не всегда полностью. Часть обучения может оплачиваться из личных средств, если денег на сертификате недостаточно или стоимость кружка выше максимальной суммы, установленной муниципалитетом</li><li><b>Платная</b> — обучение оплачивается из личных средств полностью</li></ul><p ><a id="whatIsCertificate">О дополнительном образовании и персонифицированном финансировании</a></p>',
  clarifications: aboutPaymentClarifications
};

export const HealthListElements: ListElement[] = [
  {
    id: 'empty-item',
    text: 'Без ограничений',
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
