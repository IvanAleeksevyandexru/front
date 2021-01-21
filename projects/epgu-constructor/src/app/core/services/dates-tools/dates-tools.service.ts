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
  setMonth as _setMonth,
  setDay as _setDay,
  differenceInYears as _differenceInYears,
  differenceInMilliseconds as _differenceInMilliseconds,
  endOfMonth as _endOfMonth,
  min as _min,
  max as _max,
} from 'date-fns';
import { ru as _ruLocale } from 'date-fns/locale';
import { DATE_ISO_STRING_FORMAT, DurationTimeTypes } from '../../../shared/constants/dates';

@Injectable()
export class DatesToolsService {

  constructor() { }

  /**
   * Возвращает true, если переданная дата является сегодняшней датой,
   * иначе false
   * @param {Date | Number} date значение для проверки
   */
  public isToday(date: 	Date | number): boolean {
    return _isToday(date);
  }

  /**
   * Возвращает сегодняшнюю дату
   */
  public getToday(): Date {
    return _toDate(new Date());
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
    return _isValid(date);
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
   * Возвращает true, если первая дата меньше второй,
   * иначе false
   * @param {Date | Number} dateLeft первая проверяемая дата
   * @param {Date | Number} dateRight вторая проверяемая дата
   */
  public isBefore(dateLeft: Date | number, dateRight: Date | number): boolean {
    return _isBefore(dateLeft, dateRight);
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
   * иначе backupDate
   * @param {string} date конвертируемая дата в виде строки
   * @param {string} format строка маска для распарсивания строки с датой (по умолчанию ISOString вида yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx )
   * @param {Date | Number} backupDate запасная дата на случай неудачного парсинга
   */
  public parse(date: string, format: string = DATE_ISO_STRING_FORMAT, backupDate: Date | number = new Date()): Date {
    return _parse(date, format, backupDate, { locale: _ruLocale });
  }

  /**
   * Возвращает объект даты, если переданный аргумент является валидной датой в формате ISOString,
   * иначе Invalid Date
   * @param {string} date конвертируемая дата в виде ISOString
   */
  public parseISO(date: string): Date {
    return _parseISO(date);
  }

  /**
   * Возвращает объект даты в виде строки, отформатированной по указанной маске,
   * иначе RangeError: `date must not be Invalid Date`
   * @param {Date | Number} date конвертируемая дата в виде строки
   * @param {string} format строка маска для распарсивания строки с датой (по умолчанию ISOString вида yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx )
   */
  public format(date: Date | number | string, format: string = DATE_ISO_STRING_FORMAT): string {
    if (typeof date === 'string') {
      date = this.parse(date, format);
    }
    return _format(date, format, { locale: _ruLocale });
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
    const duration = { [unit]: Number(amount) };
    return _add(date, duration);
  }

  /**
   * Возвращает новую дату минус указанное количество единиц
   * @param {Date | Number} date отправная дата отсчета
   * @param {Number} amount кол-во ед.
   * @param {DurationTimeTypes} unit ед. измерения (секунды, минуты, часы, дни, недели, месяца, года)
   */
  public sub(date: number | Date, amount: number | string, unit: DurationTimeTypes): Date {
    const duration = { [unit]: Number(amount) };
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
  public setDay(date: Date | number, day: number | string): Date {
    return _setDay(date, Number(day));
  }


    /**
   * Возвращает новый объект даты с заданными аргументами
   * @param {Date | Number} date исходная дата
   * @param {Number} year указанный год
   * @param {Number} month указанный месяц
   * @param {Number} day указанный день
   */
  public setDate(date: Date | number, year: number | string, month: number | string, day: number | string): Date {
    let newDate = this.toDate(date);
    if (year) {
      newDate = this.setYear(newDate, year);
    }
    if (month) {
      newDate = this.setMonth(newDate, month);
    }
    if (day) {
      newDate = this.setDay(newDate, day);
    }
    return newDate;
  }

  /**
   * Возвращает объект даты с концом месяца
   * @param {Date} date исходная дата
   */
  public endOfMonth(date: Date): Date {
    return _endOfMonth(date);
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

}
