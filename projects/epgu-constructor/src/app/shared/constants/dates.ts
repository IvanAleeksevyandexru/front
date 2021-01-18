const DATE_STRING_DOT_FORMAT = 'dd.MM.yyyy';
const DATE_ISO_STRING_FORMAT = 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx';
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

type DurationTimeTypes = (
  'years' |
  'months' |
  'weeks' |
  'days' |
  'hours' |
  'minutes' |
  'seconds' |
  'milliseconds'
);

const weekDaysAbbr = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export { DATE_STRING_DOT_FORMAT, DATE_ISO_STRING_FORMAT, months, weekDaysAbbr, DurationTimeTypes };
