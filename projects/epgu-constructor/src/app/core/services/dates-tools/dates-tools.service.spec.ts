import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { DatesToolsService } from './dates-tools.service';

describe('DatesToolsService', () => {
  let service: DatesToolsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatesToolsService]
    });
    service = TestBed.inject(DatesToolsService);
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
    it('should return today date', () => {
      const today = new Date();
      const serviceToday = service.getToday();
      const result = Number(today) - Number(serviceToday);
      expect(result).toEqual(0);
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
    it('should return true if two dates are equal', () => {
      const today = new Date();
      const serviceToday = service.getToday();
      expect(service.isSameDate(today, serviceToday)).toBeTruthy();
    });
    it('should return false if two dates are not equal', () => {
      const notToday = new Date(1);
      const serviceToday = service.getToday();
      expect(service.isSameDate(notToday, serviceToday)).toBeFalsy();
    });
  });

  describe('isBefore() method', () => {
    it('should return true if first date is before second date', () => {
      const beforeDate = new Date(1);
      const serviceToday = service.getToday();
      expect(service.isBefore(beforeDate, serviceToday)).toBeTruthy();
    });
    it('should return false if first date is not before second date', () => {
      const beforeDate = new Date(1);
      const serviceToday = service.getToday();
      expect(service.isBefore(serviceToday, beforeDate)).toBeFalsy();
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
