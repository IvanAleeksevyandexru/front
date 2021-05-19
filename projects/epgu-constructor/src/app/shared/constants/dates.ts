const DATE_STRING_DOT_FORMAT = 'dd.MM.yyyy';
const DATE_TIME_STRING_DOT_FORMAT = 'dd.MM.yyyy, HH:mm:ss';
const DATE_STRING_SLASH_FORMAT = 'MM/dd/yyyy';
const DATE_STRING_LLLL_YYYY_FORMAT = 'LLLL yyyy';
const DATE_ISO_STRING_FORMAT = 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx';
const DATE_MONTH_YEAR_FORMAT = 'MM/yyyy';
const DATE_HOURLY_FORMAT = 'HH:mm:ss';
const DATE_TIME_STRING_FULL = 'd MMMM yyyy года в HH:mm, eeee';
const DATE_TIME_STRING_SHORT = 'd MMMM yyyy';
const DATE_STRING_YEAR_MONTH = 'yyyy-MM';
const DATE_STRING_DASH_FORMAT = 'yyyy-MM-dd';
const BEFORE_DATE_FORMAT = 'до dd MMMM';

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
  DATE_STRING_LLLL_YYYY_FORMAT,
  DATE_ISO_STRING_FORMAT,
  DATE_MONTH_YEAR_FORMAT,
  DATE_HOURLY_FORMAT,
  DATE_TIME_STRING_FULL,
  DATE_TIME_STRING_SHORT,
  DATE_STRING_YEAR_MONTH,
  DATE_STRING_DASH_FORMAT,
  months,
  weekDaysAbbr,
  DurationTimeTypes,
  StartOfTypes,
  BEFORE_DATE_FORMAT,
};
