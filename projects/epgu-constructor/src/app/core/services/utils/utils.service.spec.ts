import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UtilsService
      ]
    });
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getObjectProperty()', () => {
    it('should return object property', () => {
      expect(UtilsService.getObjectProperty({ a: { b: { c: 3 }}}, 'a.b.c'))
        .toBe(3);
    });

    it('should return undefined if there is no object property and default value is not determined', () => {
      expect(UtilsService.getObjectProperty({ a: { b: {}}}, 'a.b.c', undefined))
        .toBe(undefined);
    });

    it('should return default value if there is no object property', () => {
      expect(UtilsService.getObjectProperty({ a: { b: {}}}, 'a.b.c', 0))
        .toBe(0);
    });

  });

  describe('getDictKeyByComp()', () => {
    it('should return dictionary key by component', () => {
      expect(UtilsService.getDictKeyByComp(
        { attrs: { dictionaryType: 'testType' }, id: 1 } as any))
        .toBe('testType1');
    });
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

  describe('cyrillicToLatin()', () => {
    it('should return undefined if there is no input word', () => {
      expect(service.cyrillicToLatin(undefined)).toBe(undefined);
      expect(service.cyrillicToLatin(null)).toBe(undefined);
    });

    it('should return latin from cyrillic', () => {
      expect(service.cyrillicToLatin('латин')).toBe('latin');
    });

    it('should return latin from cyrillic uppercase', () => {
      expect(service.cyrillicToLatin('ЛАтиН')).toBe('LAtiN');
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

  describe('isValidScenarioDto()', () => {
    it('should return true', () => {
      expect(service.isValidScenarioDto({ scenarioDto: { display: true } as any } )).toBe(true);
    });

    it('should return false', () => {
      expect(service.isValidScenarioDto({ scenarioDto: { display: false } as any } )).toBe(false);
    });

    it('should return falsy values if there is no value', () => {
      expect(service.isValidScenarioDto(null)).toBe(null);
      expect(service.isValidScenarioDto(undefined)).toBe(undefined);
    });
  });

  describe('isDefined()', () => {
    it('should return true', () => {
      expect(service.isDefined({})).toBe(true);
      expect(service.isDefined([])).toBe(true);
      expect(service.isDefined('defined string')).toBe(true);
    });

    it('should return false', () => {
      expect(service.isDefined(null)).toBe(false);
      expect(service.isDefined(undefined)).toBe(false);
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

  describe('isValidOrderId()', () => {
    it('should return true', () => {
        expect(service.isValidOrderId(10)).toBe(true);
        expect(service.isValidOrderId('10')).toBe(true);
    });

    it('should return false', () => {
      expect(service.isValidOrderId(undefined)).toBe(false);
    });
  });

  describe('hasJsonStructure()', () => {
    it('should return true', () => {
      expect(service.hasJsonStructure('{"property": true}')).toBe(true);
      expect(service.hasJsonStructure('[1,2,3]')).toBe(true);
    });

    it('should return false', () => {
      expect(service.hasJsonStructure(null)).toBe(false);
    });
  });

});
