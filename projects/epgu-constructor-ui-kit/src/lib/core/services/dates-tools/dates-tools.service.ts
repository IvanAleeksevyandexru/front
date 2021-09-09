import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  isToday as _isToday,
  toDate as _toDate,
  isValid as _isValid,
  isSameDay as _isSameDay,
  isDate as _isDate,
  isAfter as _isAfter,
  isBefore as _isBefore,
  parse as _parse,
  parseISO as _parseISO,
  format as _format,
  add as _add,
  sub as _sub,
  setYear as _setYear,
  startOfYear as _startOfYear,
  setMonth as _setMonth,
  getDate as _getDate,
  getMonth as _getMonth,
  startOfMonth as _startOfMonth,
  endOfMonth as _endOfMonth,
  getDaysInMonth as _getDaysInMonth,
  startOfDay as _startOfDay,
  getISODay as _getISODay,
  setDate as _setDate,
  differenceInYears as _differenceInYears,
  differenceInMilliseconds as _differenceInMilliseconds,
  min as _min,
  max as _max,
  intervalToDuration as _intervalToDuration,
  differenceInCalendarDays as _differenceInCalendarDays,
  startOfISOWeek as _startOfISOWeek,
  endOfISOWeek as _endOfISOWeek,
  formatISO as _formatISO,
  addDays as _addDays,
} from 'date-fns';
import { ru as _ruLocale } from 'date-fns/locale';
import { replaceArguments } from '../../decorators/replace-arguments';
import { ConfigService } from '../config/config.service';
import {
  DATE_ISO_STRING_FORMAT,
  DurationTimeTypes,
  StartOfTypes,
} from '../../../base/constants/dates';

interface Duration {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

@Injectable()
export class DatesToolsService {
  constructor(private http?: HttpClient, private configService?: ConfigService) {}

  /**
   * Возвращает true, если первая дата меньше второй,
   * иначе false
   * @param {Date | Number} dateLeft первая проверяемая дата
   * @param {Date | Number} dateRight вторая проверяемая дата
   */
  // Существуют кейзы, когда с реактивной формы приходят пустые строки в качестве первого аргумента, см. [EPGUCORE-53879]
  @replaceArguments(null, (arg) => arg === '')
  public isBefore(dateLeft: Date | number, dateRight: Date | number): boolean {
    return _isBefore(dateLeft, dateRight);
  }

  /**
   * Добавляет кол-во дней к дате.
   * @param {Date} date дата к которой нужно добавить дни
   * @param {Number} days кол-во дней которые нужно добавить к дате
   * */
  public addDays(date: Date, days: number): Date {
    return _addDays(date, days);
  }

  /**
   * Возвращает true, если переданная дата является сегодняшней датой,
   * иначе false
   * @param {Date | Number} date значение для проверки
   */
  public isToday(date: Date | number): boolean {
    return _isToday(date);
  }

  public getMonthListByYear(date: Date, formatString: string = 'yyyy-MM'): string[] {
    const nowMonth = parseInt(this.format(date, 'M'), 10);
    return new Array(12 - nowMonth + 1)
      .fill(null)
      .map((_, index) => this.format(_setMonth(date, nowMonth + index - 1), formatString));
  }

  /**
   *
   * @param resetTime если true, то сбрасывает время до 00:00:00
   * @returns Возвращает сегодняшнюю дату
   */
  public async getToday(resetTime = false): Promise<Date> {
    const path = this.configService.apiUrl + '/service/actions/currentDateTime';
    const timeString = await this.http
      .get(path, { responseType: 'text', withCredentials: true })
      .toPromise();
    const date = new Date(timeString);
    if (resetTime) {
      date.setFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }

  /**
   * Пробует преобразовать переданный аргумент в объект даты
   * Если аргумент инстанс даты, то функция вернет клон даты
   * Если аргумент число, то функция попытается прочитать его как timestamp
   * Если аргумент строка, то функция попытается распарсить его
   * Если ничего из вышеперечисленного, функция вернет Invalid Date
   * @param {Date | Number} date значение для конвертации
   */
  public toDate(date: Date | number | string): Date {
    if (typeof date === 'string') {
      date = this.parse(date);
    }
    return _toDate(date);
  }

  /**
   * Возвращает true, если переданный аргумент является датой,
   * иначе false
   * @param {unknown} date проверяемая сущность, является ли датой
   */
  public isDate(date: unknown): boolean {
    return _isDate(date);
  }

  /**
   * Возвращает true, если переданный аргумент является валидной датой
   * иначе false
   * @param {unknown} date проверяемая сущность, является ли валидной датой
   */
  public isValid(date: unknown): boolean {
    return date instanceof Date ? _isValid(date) : _isValid(this.parseISO(date as string));
  }

  /**
   * Возвращает true, если переданные аргументы является одной и той же датой,
   * иначе false
   * @param {Date | Number} dateLeft первая проверяемая дата
   * @param {Date | Number} dateRight вторая проверяемая дата
   */
  public isSameDate(dateLeft: Date | number, dateRight: Date | number): boolean {
    return _isSameDay(dateLeft, dateRight);
  }

  /**
   * Возвращает true, если первая дата больше второй,
   * иначе false
   * @param {Date | Number} dateLeft первая проверяемая дата
   * @param {Date | Number} dateRight вторая проверяемая дата
   */
  public isAfter(dateLeft: Date | number, dateRight: Date | number): boolean {
    return _isAfter(dateLeft, dateRight);
  }

  /**
   * Возвращает true, если переданные аргументы является одной и той же датой,
   * или первая дата больше второй,
   * иначе false
   * @param {Date | Number} dateLeft первая проверяемая дата
   * @param {Date | Number} dateRight вторая проверяемая дата
   */
  public isSameOrAfter(dateLeft: Date | number, dateRight: Date | number): boolean {
    return _isSameDay(dateLeft, dateRight) || _isAfter(dateLeft, dateRight);
  }

  /**
   * Возвращает true, если переданные аргументы является одной и той же датой,
   * или первая дата меньше второй,
   * иначе false
   * @param {Date | Number} dateLeft первая проверяемая дата
   * @param {Date | Number} dateRight вторая проверяемая дата
   */
  public isSameOrBefore(dateLeft: Date | number, dateRight: Date | number): boolean {
    return _isSameDay(dateLeft, dateRight) || _isBefore(dateLeft, dateRight);
  }

  /**
   * Возвращает объект даты, если переданный аргумент является валидной строковой датой,
   * согласно переданной строке маски,
   * иначе Invalid Date
   * @param {string} date конвертируемая дата в виде строки
   * @param {string} format строка маска для распарсивания строки с датой (по умолчанию ISOString вида yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx )
   * @param {Date | Number} referenceDate референсная дата для использования недостающих ед. в распарсенной дате
   */
  public parse(
    date: string,
    format: string = DATE_ISO_STRING_FORMAT,
    referenceDate: Date | number = new Date(),
  ): Date {
    return _parse(date, format, referenceDate, { locale: _ruLocale });
  }

  /**
   * Возвращает объект даты, если переданный аргумент является валидной строковой датой ISOString формата
   * иначе Invalid Date
   * @param {string} date конвертируемая дата в виде строки
   */
  public parseISO(date: string): Date {
    return _parseISO(date);
  }

  /**
   * Возвращает объект даты в виде строки, отформатированной по указанной маске,
   * иначе Invalid Date
   * @param {Date | Number} date конвертируемая дата в виде строки
   * @param {string} format строка маска для распарсивания строки с датой (по умолчанию ISOString вида yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx )
   * @todo параметр format используется и для парсинга первого параметра, если он передан в виде строки, и
   * для форматирования результата. Тогда зачем нужна возможность передавать первым параметром строку, если она вернется в
   * том же формате?
   */
  public format(date: Date | number | string, format: string = DATE_ISO_STRING_FORMAT): string {
    let newDate;
    if (!date) {
      return '';
    }
    if (typeof date === 'string') {
      newDate = this.parse(date, format);
    } else {
      newDate = new Date(date);
    }

    // Если временная зона меньше UTC 00:00 то для избежания смещения дня делается установка года/месяца/дня по UTC
    const zoneOffset = newDate.getTimezoneOffset();
    const needToOffsetZone = Math.sign(zoneOffset) === 1;
    if (needToOffsetZone) {
      newDate.setFullYear(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate());
    }

    return _format(newDate, format, { locale: _ruLocale });
  }

  /**
   * Возвращает объект даты в виде строки в ISO формате
   * @param {Date | Number} date дата для преобразования
   * @param {object} options дополнительные опции, см. https://date-fns.org/v2.21.3/docs/formatISO
   */
  public formatISO(date: Date | number, options?): string {
    return _formatISO(date, options);
  }

  /**
   * Возвращает число полных лет между первой и второй датой
   * @param {Date | Number} dateLeft первая проверяемая дата
   * @param {Date | Number} dateRight вторая проверяемая дата
   */
  public differenceInYears(dateLeft: Date | number, dateRight: Date | number): number {
    return _differenceInYears(dateLeft, dateRight);
  }

  /**
   * Возвращает число милисекунд между первой и второй датой
   * @param {Date | Number} dateLeft первая проверяемая дата
   * @param {Date | Number} dateRight вторая проверяемая дата
   */
  public diff(dateLeft: Date | number, dateRight: Date | number): number {
    return _differenceInMilliseconds(dateLeft, dateRight);
  }

  /**
   * Возвращает новую дату плюс указанное количество единиц
   * @param {Date | Number} date отправная дата отсчета
   * @param {Number} amount кол-во ед.
   * @param {DurationTimeTypes} unit ед. измерения (секунды, минуты, часы, дни, недели, месяца, года)
   */
  public add(date: number | Date, amount: number | string, unit: DurationTimeTypes): Date {
    const duration = this.getDuration(amount, unit);
    return _add(date, duration);
  }

  /**
   * Возвращает новую дату минус указанное количество единиц
   * @param {Date | Number} date отправная дата отсчета
   * @param {Number} amount кол-во ед.
   * @param {DurationTimeTypes} unit ед. измерения (секунды, минуты, часы, дни, недели, месяца, года)
   */
  public sub(date: number | Date, amount: number | string, unit: DurationTimeTypes): Date {
    const duration = this.getDuration(amount, unit);
    return _sub(date, duration);
  }

  /**
   * Возвращает новый объект даты с заданным годом
   * @param {Date | Number} date исходная дата
   * @param {Number} year указанный год
   */
  public setYear(date: Date | number, year: number | string): Date {
    return _setYear(date, Number(year));
  }

  /**
   * Возвращает объект даты с началом года
   * @param {Date | Number} date исходная дата
   */
  public startOfYear(date: Date | number): Date {
    return _startOfYear(date);
  }

  /**
   * Возвращает новый объект даты с заданным месяцем
   * @param {Date | Number} date исходная дата
   * @param {Number} month указанный месяц
   */
  public setMonth(date: Date | number, month: number | string): Date {
    return _setMonth(date, Number(month));
  }

  /**
   * Возвращает новый объект даты с заданным днем
   * @param {Date | Number} date исходная дата
   * @param {Number} day указанный день
   */
  public setDate(date: Date | number, day: number | string): Date {
    return _setDate(date, Number(day));
  }

  /**
   * Возвращает объект даты с началом дня
   * @param {Date | Number} date исходная дата
   */
  public startOfDay(date: Date | number): Date {
    let newDate = new Date(date);
    const zoneOffset = newDate.getTimezoneOffset();
    // Если временная зона меньше UTC 00:00 то для избежания смещения дня делается установка года/месяца/дня по UTC
    const needToOffsetZone = Math.sign(zoneOffset) === 1;
    if (needToOffsetZone) {
      newDate = this.add(newDate, zoneOffset, 'minutes');
    }
    return _startOfDay(newDate);
  }

  /**
   * Возвращает день недели переданной даты
   * @param {Date | Number} date исходная дата
   */
  public getISODay(date: Date | number): number {
    return _getISODay(date);
  }

  public startOf(date: Date | number, startType: StartOfTypes): Date {
    switch (startType) {
      case 'day':
        return this.startOfDay(date);
      case 'month':
        return this.startOfMonth(date);
      case 'year':
        return this.startOfYear(date);
    }
  }

  /**
   * Возвращает новый объект даты с заданными аргументами
   * @param {Date | Number} date исходная дата
   * @param {Number} year указанный год
   * @param {Number} month указанный месяц
   * @param {Number} day указанный день
   */
  public setCalendarDate(
    date: Date | number,
    year: number | string = null,
    month: number | string = null,
    day: number | string = null,
  ): Date {
    let newDate = this.toDate(date);
    const zoneOffset = newDate.getTimezoneOffset();
    // Если временная зона меньше UTC 00:00 то для избежания смещения дня делается установка года/месяца/дня по UTC
    const needToOffsetZone = Math.sign(zoneOffset) === 1;
    if (needToOffsetZone) {
      newDate = this.add(newDate, zoneOffset, 'minutes');
    }
    if (year !== null) {
      newDate = this.setYear(newDate, year);
    }
    if (month !== null) {
      newDate = this.setMonth(newDate, month);
    }
    if (day !== null) {
      newDate = this.setDate(newDate, day);
    }
    if (needToOffsetZone) {
      newDate = this.add(newDate, -zoneOffset, 'minutes');
    }
    return newDate;
  }

  /**
   * Возвращает месяц переданной даты
   * @param {Date | Number} date исходная дата
   */
  public getMonth(date: Date | number): number {
    return _getMonth(date);
  }

  /**
   * Возвращает день месяца
   * @param {Date} date исходная дата
   */
  public getDate(date: Date): number {
    return _getDate(date);
  }

  /**
   * Возвращает объект даты с началом месяца
   * @param {Date | Number} date исходная дата
   */
  public startOfMonth(date: Date | number): Date {
    return _startOfMonth(date);
  }

  /**
   * Возвращает объект даты с концом месяца
   * @param {Date | Number} date исходная дата
   */
  public endOfMonth(date: Date | number): Date {
    let newDate = _endOfMonth(date);
    // Для избежания смещения дня делается установка года/месяца/дня по UTC
    newDate.setUTCFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    return newDate;
  }

  /**
   * Возврпащает количество дней в месяце
   * @param {Date} date исходная дата
   */
  public getDaysInMonth(date: Date): number {
    let newDate = new Date(date);
    const zoneOffset = newDate.getTimezoneOffset();
    // Если временная зона меньше UTC 00:00 то для избежания смещения дня делается установка года/месяца/дня по UTC
    const needToOffsetZone = Math.sign(zoneOffset) === 1;
    if (needToOffsetZone) {
      newDate.setFullYear(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate());
    }
    return _getDaysInMonth(newDate);
  }

  /**
   * Возвращает самую раннюю дату из массива дат
   * @param {Date[]} dates проверяемые даты
   */
  public min(dates: Date[]): Date {
    return _min(dates);
  }

  /**
   * Возвращает самую позднюю дату из массива дат
   * @param {Date[]} dates проверяемые даты
   */
  public max(dates: Date[]): Date {
    return _max(dates);
  }

  /**
   * Возвращает duration объект для переданного отрезка времени
   * @param {start: Date | Number, end: Date | Number} interval объект интервала, состоящий из начала и конца временного отрезка
   */
  public intervalToDuration(interval: { start: Date | number; end: Date | number }): Duration {
    return _intervalToDuration(interval);
  }

  /**
   * Аналог utcOffset у moment. Смещает время относительно таймзоны.
   * @param {Date} date исходная дата
   * @param {String} timezone Таймзона в формате '+HH:mm'
   */
  public utcOffset(date: Date, timezone: string): Date {
    let copiedDate = this.toDate(date);
    copiedDate.setMinutes(copiedDate.getMinutes() + copiedDate.getTimezoneOffset());

    const pattern = /^((\+|-)?[0-9]{2}):([0-9]{2})$/;
    if (timezone.match(pattern)) {
      const [, hours, , minutes] = timezone.match(pattern);

      copiedDate = this.add(copiedDate, Number(hours), 'hours');
      copiedDate = this.add(copiedDate, Number(minutes), 'minutes');
    }

    return copiedDate;
  }

  /**
   *
   * @param date1 первая дата
   * @param date2 вторая дата
   * @returns возращает разницу в днях. date2 минус date1
   */
  public differenceInCalendarDays(date1: Date | number, date2: Date | number): number {
    return _differenceInCalendarDays(date2, date1);
  }

  /**
   *
   * @param date дата
   * @returns возращает начало недели
   */
  public startOfISOWeek(date: Date | number): Date {
    return _startOfISOWeek(date);
  }

  /**
   *
   * @param date дата
   * @returns возращает конец недели
   */
  public endOfISOWeek(date: Date | number): Date {
    return _endOfISOWeek(date);
  }

  /**
   * Преобразовывает продолжительность из формата moment.js в dateFns
   * Нужно например для restrictions формата 30, 'd'
   * @param {Number | String} amount длина продолжительности
   * @param {String} unit Единицы измерения продолжительности
   * @throws Error бросает ошибку если передать неизвестные единицы измерения
   * это ведь лучше чем тихо ничего не менять
   */
  private getDuration(
    amount: number | string,
    unit: string,
  ): { [key in DurationTimeTypes]: number } {
    const momentToDateFnsUnits: { [key: string]: DurationTimeTypes } = {
      y: 'years',
      year: 'years',
      years: 'years',
      M: 'months',
      month: 'months',
      months: 'months',
      w: 'weeks',
      week: 'weeks',
      weeks: 'weeks',
      d: 'days',
      day: 'days',
      days: 'days',
      h: 'hours',
      hour: 'hours',
      hours: 'hours',
      m: 'minutes',
      minute: 'minutes',
      minutes: 'minutes',
      s: 'seconds',
      second: 'seconds',
      seconds: 'seconds',
    };

    if (!(unit in momentToDateFnsUnits)) {
      throw new Error(`${unit} in not supported yet or incorrect`);
    }

    const translatedUnit: DurationTimeTypes = momentToDateFnsUnits[unit];

    return { [translatedUnit]: Number(amount) } as { [key in DurationTimeTypes]: number };
  }
}
