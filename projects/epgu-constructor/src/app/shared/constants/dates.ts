const DATE_STRING_DOT_FORMAT = 'dd.MM.yyyy';
const DATE_TIME_STRING_DOT_FORMAT = 'dd.MM.yyyy, HH:mm:ss';
const DATE_STRING_SLASH_FORMAT = 'MM/dd/yyyy';
const DATE_STRING_MMMM_YYYY_FORMAT = 'MMMM yyyy';
const DATE_ISO_STRING_FORMAT = 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx';
const DATE_MONTH_YEAR_FORMAT = 'MM/yyyy';
const DATE_HOURLY_FORMAT = 'HH:mm:ss';
const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

type DurationTimeTypes =
  | 'years'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'milliseconds';

type StartOfTypes =
  | 'year'
  | 'month'
  | 'day';

const weekDaysAbbr = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export {
  DATE_STRING_DOT_FORMAT,
  DATE_TIME_STRING_DOT_FORMAT,
  DATE_STRING_SLASH_FORMAT,
  DATE_STRING_MMMM_YYYY_FORMAT,
  DATE_ISO_STRING_FORMAT,
  DATE_MONTH_YEAR_FORMAT,
  DATE_HOURLY_FORMAT,
  months,
  weekDaysAbbr,
  DurationTimeTypes,
  StartOfTypes,
};
