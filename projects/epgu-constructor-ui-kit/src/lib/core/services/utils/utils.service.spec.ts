import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';
import { configureTestSuite } from 'ng-bullet';
import { TypeHelperService } from '../type-helper/type-helper.service';

describe('UtilsService', () => {
  let service: UtilsService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        UtilsService,
        TypeHelperService,
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(UtilsService);
  });

  describe('htmlToText()', () => {
    it('should return text from html', () => {
      expect(UtilsService.htmlToText('Text <span>additional info</span>'))
        .toBe('Text additional info');
    });
  });

  describe('getDeclension()', () => {
    const forms = ['год', 'года', 'лет'];

    it('should return the first form', () => {
      expect(service.getDeclension(1, forms)).toBe(forms[0]);
    });

    it('should return the second form', () => {
      expect(service.getDeclension(2, forms)).toBe(forms[1]);
      expect(service.getDeclension(3, forms)).toBe(forms[1]);
      expect(service.getDeclension(4, forms)).toBe(forms[1]);
    });

    it('should return the third form', () => {
      expect(service.getDeclension(5, forms)).toBe(forms[2]);
      expect(service.getDeclension(6, forms)).toBe(forms[2]);
      expect(service.getDeclension(7, forms)).toBe(forms[2]);
      expect(service.getDeclension(8, forms)).toBe(forms[2]);
      expect(service.getDeclension(9, forms)).toBe(forms[2]);
    });

    it('should return the third form if value is exceptional', () => {
      expect(service.getDeclension(11, forms)).toBe(forms[2]);
      expect(service.getDeclension(12, forms)).toBe(forms[2]);
    });

    it('should work with values above 20', () => {
      expect(service.getDeclension(21, forms)).toBe(forms[0]);
      expect(service.getDeclension(22, forms)).toBe(forms[1]);
      expect(service.getDeclension(25, forms)).toBe(forms[2]);
    });
  });

  describe('getSplittedUrl()', () => {
    it('should return splitted url', () => {
      const splittedUrl = service.getSplittedUrl('test.com/test?queryParam=queryParam');

      expect(splittedUrl[0]).toBe('test.com');
      expect(splittedUrl[1]).toBe('test');
      expect(splittedUrl[2]).toBe(undefined);
    });
  });



  describe('getServiceName()', () => {
    it('should return service name', () => {
      expect(service.getServiceName('https://www.gosuslugi.ru/600101/1/form-item')).toBe('FormItemService');
    });

    it('shouldn\'t return service name if path is incorrect ', () => {
      expect(service.getServiceName('https://www.gosuslugi.ru/600101/form')).not.toBe('FormService');
    });

  });

  describe('isValidHttpUrl()', () => {
    it('should return true', () => {
      expect(service.isValidHttpUrl('url')).toBe(true);
    });

    it('should return false', () => {
      expect(service.isValidHttpUrl(undefined)).not.toBe(false);
    });
  });


  describe('filterIncorrectObjectFields()', () => {
    it('should return object with all fields are defined', () => {
      expect(service.filterIncorrectObjectFields({ nullProperty: null, undefinedProperty: undefined, total: 4 }))
        .toEqual({ total: 4 });
    });

    it('shouldn\'t filter fields in all nested objects', () => {
      expect(service.filterIncorrectObjectFields({ nestedObject: { property: null }}))
        .toEqual({ nestedObject: { property: null }});
    });

    it('should return {} if object is {} or []', () => {
      expect(service.filterIncorrectObjectFields([])).toEqual({});
      expect(service.filterIncorrectObjectFields({})).toEqual({});
    });
  });

  describe('hasJsonStructure()', () => {
    it('should return true', () => {
      expect(UtilsService.hasJsonStructure('{"property": true}')).toBe(true);
      expect(UtilsService.hasJsonStructure('[1,2,3]')).toBe(true);
    });

    it('should return false', () => {
      expect(UtilsService.hasJsonStructure(null)).toBe(false);
    });
  });

});
