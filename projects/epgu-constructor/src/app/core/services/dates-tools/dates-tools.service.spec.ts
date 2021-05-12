import { TestBed } from '@angular/core/testing';
import {
  DATE_ISO_STRING_FORMAT,
  DATE_TIME_STRING_DOT_FORMAT,
  DATE_STRING_DOT_FORMAT,
  DATE_STRING_SLASH_FORMAT, DurationTimeTypes
} from '../../../shared/constants/dates';
import { DatesToolsService } from './dates-tools.service';
import * as moment_ from 'moment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

const moment = moment_;
moment.locale('ru');

jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01').getTime());

describe('DatesToolsService', () => {
  let service: DatesToolsService;
  let httpTestingController: HttpTestingController;
  const MOCK_TODAY = '2020-01-01T00:00:00.000Z';
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DatesToolsService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DatesToolsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    jest.spyOn(service, 'getToday').mockReturnValue(Promise.resolve(new Date(MOCK_TODAY)));
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('isToday() method', () => {
    it('should return true if date is today', () => {
      const today = new Date();
      expect(service.isToday(today)).toBeTruthy();
    });
    it('should return false if date is not today', () => {
      const notToday = new Date(1);
      expect(service.isToday(notToday)).toBeFalsy();
    });
  });

  describe('getToday() method', () => {
    it('should return today date', (done) => {
      (service.getToday as jest.Mock).mockRestore();

      service.getToday().then((response) => {
        expect(response.getTime()).toBe(new Date(MOCK_TODAY).getTime());
        done();
      });

      const req = httpTestingController.expectOne('api/service/actions/currentDateTime');
      expect(req.request.method).toBe('GET');

      req.flush(MOCK_TODAY);
    });
  });

  describe('toDate() method', () => {
    it('should return date object when date object passed as argument', () => {
      const date = new Date();
      expect(service.toDate(date)).toBeInstanceOf(Date);
    });
    it('should return date object when number passed as argument', () => {
      const timestamp = Date.now();
      expect(service.toDate(timestamp)).toBeInstanceOf(Date);
    });
    it('should return date object when valid date string passed as argument', () => {
      const string = `${Date.now()}`;
      expect(service.toDate(string)).toBeInstanceOf(Date);
    });
    it('should return Invalid Date when invalid date string passed as argument', () => {
      const string = 'abc';
      const resultDate = service.toDate(string);
      expect(resultDate.toString()).toEqual('Invalid Date');
    });
    it('should return Invalid Date when invalid argument is passed', () => {
      const string = {} as string;
      const resultDate = service.toDate(string);
      expect(resultDate.toString()).toEqual('Invalid Date');
    });
  });

  describe('isDate() method', () => {
    it('should return true if passed parameter is date', () => {
      expect(service.isDate(MOCK_TODAY)).toBeFalsy();
      expect(service.isDate(new Date())).toBeTruthy();
    });
  });

  describe('isValid() method', () => {
    it('should return true is valid date passed', () => {
      const today = new Date();
      expect(service.isValid(today)).toBeTruthy();
    });
    it('should return false is invalid date passed', () => {
      const today = {};
      expect(service.isValid(today)).toBeFalsy();
    });
  });

  describe('isSameDate() method', () => {
    it('should return true if two dates are equal', async () => {
      const today = new Date();
      const serviceToday = await service.getToday();
      expect(service.isSameDate(today, serviceToday)).toBeTruthy();
    });
    it('should return false if two dates are not equal', async () => {
      const notToday = new Date(1);
      const serviceToday = await service.getToday();
      expect(service.isSameDate(notToday, serviceToday)).toBeFalsy();
    });
  });

  describe('isBefore() method', () => {
    it('should return true if first date is before second date', async () => {
      const beforeDate = new Date(1);
      const serviceToday = await service.getToday();
      expect(service.isBefore(beforeDate, serviceToday)).toBeTruthy();
    });
    it('should return false if first date is not before second date', async () => {
      const beforeDate = new Date(1);
      const serviceToday = await service.getToday();
      expect(service.isBefore(serviceToday, beforeDate)).toBeFalsy();
    });
  });

  describe('isSameOrBefore() method', () => {
    it('should return true if first date is before second date', async () => {
      const beforeDate = new Date(1);
      const serviceToday = await service.getToday();
      expect(service.isSameOrBefore(beforeDate, serviceToday)).toBeTruthy();
    });
    it('should return true if first date is same as second date', async () => {
      const today = new Date();
      const serviceToday = await service.toDate(today);
      expect(service.isSameOrBefore(serviceToday, today)).toBeTruthy();
    });
    it('should return false if first date is not before second date', async () => {
      const beforeDate = new Date(1);
      const serviceToday = await service.getToday();
      expect(service.isSameOrBefore(serviceToday, beforeDate)).toBeFalsy();
    });
  });

  describe('isAfter() method', () => {
    it('should return true if first date is after second date', async () => {
      const beforeDate = new Date(1);
      const serviceToday = await service.getToday();
      expect(service.isAfter(serviceToday, beforeDate)).toBeTruthy();
    });
    it('should return false if first date is not after second date', async () => {
      const beforeDate = new Date(1);
      const serviceToday = await service.getToday();
      expect(service.isAfter(beforeDate, serviceToday)).toBeFalsy();
    });
  });

  describe('isSameOrAfter() method', () => {
    it('should return true if first date is after second date', async () => {
      const beforeDate = new Date(1);
      const serviceToday = await service.getToday();
      expect(service.isSameOrAfter(serviceToday, beforeDate)).toBeTruthy();
    });
    it('should return true if first date is same as second date', async () => {
      const today = new Date();
      const serviceToday = await service.toDate(today);
      expect(service.isSameOrAfter(serviceToday, today)).toBeTruthy();
    });
    it('should return false if first date is not after second date', async () => {
      const beforeDate = new Date(1);
      const serviceToday = await service.getToday();
      expect(service.isSameOrAfter(beforeDate, serviceToday)).toBeFalsy();
    });
  });

  describe('parse() method', () => {
    it('should return date object if passed string data and format are valid', () => {
      const strDate = new Date().toISOString();
      const format = DATE_ISO_STRING_FORMAT;
      const resultDate = service.parse(strDate, format);
      expect(service.parse(strDate, format)).toEqual(resultDate);
    });
    it('should return Invalid Date, if passed string date or format are invalid', () => {
      const strDate = '11.12';
      const format = DATE_STRING_DOT_FORMAT;
      const resultDate = service.parse(strDate, format);
      expect(resultDate.toString()).toEqual('Invalid Date');
    });
  });

  describe('parseISO() method', () => {
    it('should return date object if passed string data has ISOString format', () => {
      expect(service.parseISO('2005-05-05T00:00:00Z')).toBeInstanceOf(Date);
    });
  });

  describe('format() method', () => {
    it('should return empty string if date parameter is empty', () => {
      expect(service.format('')).toEqual('');
    });
    it('should return formatted date string if date parameter is string', () => {
      expect(service.format('02.01.2000', DATE_STRING_DOT_FORMAT)).toEqual('02.01.2000');
    });
    it('should return formatted date string if date parameter is Date object', () => {
      const date = new Date(1);
      const format = DATE_STRING_DOT_FORMAT;
      expect(service.format(date, format)).toEqual('01.01.1970');
    });
  });

  describe('differenceInYears() method', () => {
    it('should return full years between two dates', () => {
      const dateLeft = service.parse('02.01.2000', DATE_STRING_DOT_FORMAT);
      const dateRight = new Date(1);
      const passedYears = 30;
      expect(service.differenceInYears(dateLeft, dateRight)).toEqual(passedYears);
    });
  });

  describe('diff() method', () => {
    it('should return miliseconds between two dates', () => {
      const dateLeft = new Date();
      const dateRight = service.add(dateLeft, 1, 'seconds');
      const passedTime = -1000;
      expect(service.diff(dateLeft, dateRight)).toEqual(passedTime);
    });
  });

  describe('add() method', () => {
    it('should return added date', () => {
      const date = new Date(1);
      const controlDate = service.parse('01.01.2000', DATE_STRING_DOT_FORMAT);
      const resultDate = service.add(date, 30, 'years');
      expect(service.isSameDate(controlDate, resultDate)).toBeTruthy();
    });

    it('should throw error if unit parameter is invalid', () => {
      const date = new Date(1);
      expect(() => {
        service.add(date, 30, 'yearsssss' as DurationTimeTypes);
      }).toThrow('yearsssss in not supported yet or incorrect');
    });
  });

  describe('sub() method', () => {
    it('should return subtracted date', () => {
      const date = service.parse('01.01.2000', DATE_STRING_DOT_FORMAT);
      const controlDate = new Date(1);
      const resultDate = service.sub(date, 30, 'years');
      expect(service.isSameDate(controlDate, resultDate)).toBeTruthy();
    });
  });

  describe('setDate() method', () => {
    it('should return setted date', () => {
      expect(service.format(service.setCalendarDate(new Date(2014, 8, 1), null, null, 30), DATE_TIME_STRING_DOT_FORMAT))
        .toEqual('30.09.2014, 00:00:00');
    });

    it('should return setted date for january', () => {
      const date = new Date();
      const controlDate = new Date(1);
      const resultDate = service.setCalendarDate(date, 1970, 0, 1);
      expect(service.isSameDate(controlDate, resultDate)).toBeTruthy();
    });
  });

  describe('startOf', () => {
    const date = new Date();

    it('should return startOfDay() result', () => {
      jest.spyOn(service, 'startOfDay').mockReturnValue(date);
      const result = service.startOf(new Date(2014, 8, 2, 11, 55, 0), 'day');
      expect(result.getTime()).toBe(date.getTime());
    });

    it('should return startOfMonth() result', () => {
      jest.spyOn(service, 'startOfMonth').mockReturnValue(date);
      const result = service.startOf(new Date(2014, 8, 2, 11, 55, 0), 'month');
      expect(result.getTime()).toBe(date.getTime());
    });

    it('should return startOfYear() result', () => {
      jest.spyOn(service, 'startOfYear').mockReturnValue(date);
      const result = service.startOf(new Date(2014, 8, 2, 11, 55, 0), 'year');
      expect(result.getTime()).toBe(date.getTime());
    });
  });

  describe('endOfMonth() method', () => {
    it('should return date end of month', () => {
      expect(service.format(service.endOfMonth(new Date(2014, 8, 2, 11, 55, 0)), DATE_TIME_STRING_DOT_FORMAT))
        .toEqual('30.09.2014, 23:59:59');
    });
  });

  describe('startOfYear() method', () => {
    it('should return start date of year', () => {
      expect(service.format(service.startOfYear(new Date(2014, 8, 2, 11, 55, 0)), DATE_TIME_STRING_DOT_FORMAT))
        .toEqual('01.01.2014, 00:00:00');
    });
  });

  describe('startOfMonth() method', () => {
    it('should return start date of month', () => {
      expect(service.format(service.startOfMonth(new Date(2014, 8, 2, 11, 55, 0)), DATE_TIME_STRING_DOT_FORMAT))
        .toEqual('01.09.2014, 00:00:00');
    });
  });

  describe('startOfDay() method', () => {
    it('should return start date of day', () => {
      expect(service.format(service.startOfDay(new Date(2014, 8, 2, 11, 55, 0)), DATE_TIME_STRING_DOT_FORMAT))
        .toEqual('02.09.2014, 00:00:00');
    });
  });

  describe('getISODay() method', () => {
    it('should return day of week of passed date', () => {
      expect(service.getISODay(new Date(2012, 1, 26))).toEqual(7);
    });
  });

  describe('getMonth() method', () => {
    it('should return month of passed date', () => {
      expect(service.getMonth(new Date(2012, 1, 29))).toEqual(1);
    });
  });

  describe('getDaysInMonth() method', () => {
    it('should amount of days in passed date', () => {
      expect(service.getDaysInMonth(new Date(2000, 1))).toEqual(29);
    });
  });

  describe('getDate() method', () => {
    it('should return day of the month', () => {
      expect(service.getDate(new Date(2000, 2, 13))).toEqual(13);
      expect(service.getDate(new Date(2000, 3, 8))).toEqual(8);
    });
  });

  describe('min() method', () => {
    it('should return min date from array of dates', () => {
      const dateLeft = service.parse('02.01.2000', DATE_STRING_DOT_FORMAT);
      const dateRight = new Date(1);
      expect(service.min([dateLeft, dateRight])).toEqual(dateRight);
    });
  });

  describe('max() method', () => {
    it('should return max date from array of dates', () => {
      const dateLeft = service.parse('02.01.2000', DATE_STRING_DOT_FORMAT);
      const dateRight = new Date(1);
      expect(service.max([dateLeft, dateRight])).toEqual(dateLeft);
    });
  });

  describe('intervalToDuration() method', () => {
    it('should return duration object for passed interval', () => {
      expect(
        service.intervalToDuration({
          start: new Date(1929, 0, 15, 12, 0, 0),
          end: new Date(1968, 3, 4, 19, 5, 0),
        }),
      ).toEqual({ years: 39, months: 2, days: 20, hours: 7, minutes: 5, seconds: 0 });
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('utcOffset works like in moment', () => {
    const getExpected = (slotTime, timezone) => {
      const time = moment(slotTime).utcOffset(timezone);
      return time.format('D MMMM YYYY года в HH:mm, dddd');
    };

    const getActual = (slotTime, timezone) => {
      let time = service.utcOffset(slotTime, timezone);

      return service.format(time, 'd MMMM yyyy года в HH:mm, eeee');
    };

    [
      { slotTime: new Date('2020-05-15'), timezone: '+08:00' },
      { slotTime: new Date('2020-01-31'), timezone: '+05:00' },
      { slotTime: new Date('2021-01-31'), timezone: '-08:00' },
      { slotTime: new Date('2021-02-28'), timezone: '+00:00' },
      { slotTime: new Date('2021-05-15'), timezone: '-02:00' },
      { slotTime: new Date('2021-11-11'), timezone: '+06:00' },
    ].forEach(({ slotTime, timezone }) => {
      expect(getActual(slotTime, timezone)).toEqual(getExpected(slotTime, timezone));
    });
  });
});
