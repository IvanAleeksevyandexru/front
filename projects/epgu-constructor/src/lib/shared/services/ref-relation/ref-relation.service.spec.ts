import { TestBed } from '@angular/core/testing';
import { RefRelationService } from './ref-relation.service';
import {
  autofillFromDictionaryRefMock,
  calcRefMock,
  disabledRefMock,
  displayOffRefMock,
  displayOnRefMock,
  filterOnRefMock,
  getValueRefMock,
} from './ref-relation.mock';
import { configureTestSuite } from 'ng-bullet';
import { ListElement } from '@epgu/ui/models/dropdown';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';

describe('RefRelationService', () => {
  let service: RefRelationService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [RefRelationService, JsonHelperService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(RefRelationService);
  });

  describe('Check relation type cases', () => {
    describe('isDisplayOffRelation()', () => {
      it('should return true when pass displayOff ref', () => {
        const result = service.isDisplayOffRelation(displayOffRefMock.relation);
        expect(result).toBeTruthy();
      });

      it('should return false when not pass displayOff ref', () => {
        const result = service.isDisplayOffRelation(displayOnRefMock.relation);
        expect(result).toBeFalsy();
      });
    });

    describe('isDisplayOnRelation()', () => {
      it('should return true when pass displayOn ref', () => {
        const result = service.isDisplayOnRelation(displayOnRefMock.relation);
        expect(result).toBeTruthy();
      });

      it('should return false when not pass displayOn ref', () => {
        const result = service.isDisplayOnRelation(displayOffRefMock.relation);
        expect(result).toBeFalsy();
      });
    });

    describe('isGetValueRelation()', () => {
      it('should return true when pass getValue ref', () => {
        const result = service.isGetValueRelation(getValueRefMock.relation);
        expect(result).toBeTruthy();
      });

      it('should return false when not pass getValue ref', () => {
        const result = service.isGetValueRelation(displayOffRefMock.relation);
        expect(result).toBeFalsy();
      });
    });

    describe('isAutofillFromDictionaryRelation()', () => {
      it('should return true when pass autofillFromDictionary ref', () => {
        const result = service.isAutofillFromDictionaryRelation(
          autofillFromDictionaryRefMock.relation,
        );
        expect(result).toBeTruthy();
      });

      it('should return false when not pass autofillFromDictionary ref', () => {
        const result = service.isAutofillFromDictionaryRelation(displayOffRefMock.relation);
        expect(result).toBeFalsy();
      });
    });

    describe('isCalcRelation()', () => {
      it('should return true when pass calc ref', () => {
        const result = service.isCalcRelation(calcRefMock.relation);
        expect(result).toBeTruthy();
      });

      it('should return false when not pass calc ref', () => {
        const result = service.isCalcRelation(displayOffRefMock.relation);
        expect(result).toBeFalsy();
      });
    });

    describe('isDisabledRelation()', () => {
      it('should return true when pass disabled ref', () => {
        const result = service.isDisabledRelation(disabledRefMock.relation);
        expect(result).toBeTruthy();
      });

      it('should return false when not pass disabled ref', () => {
        const result = service.isDisabledRelation(displayOffRefMock.relation);
        expect(result).toBeFalsy();
      });
    });

    describe('isFilterOnRelation()', () => {
      it('should return true when pass filterOn ref', () => {
        const result = service.isFilterOnRelation(filterOnRefMock.relation);
        expect(result).toBeTruthy();
      });

      it('should return false when not pass filterOn ref', () => {
        const result = service.isFilterOnRelation(displayOffRefMock.relation);
        expect(result).toBeFalsy();
      });
    });

    describe('getValueFromComponentVal()', () => {
      it('should return component string value, if arg is string', () => {
        const value = 'value';
        expect(service['getValueFromComponentVal'](value)).toBe(value);
      });
      it('should return component string value, if arg is {id: string}', () => {
        const value = { id: 'value' };
        expect(service['getValueFromComponentVal'](value)).toBe('value');
      });

      it('should return component as original array, if arg is array', () => {
        const value = [{ id: 'value' }] as ListElement[];
        expect(service['getValueFromComponentVal'](value)).toBe(value);
      });
      it('should return item id, if arg is JSON-stringified obj with id attr', () => {
        const value = '{"id": "AUS", "label":"Австралия"}';
        const expectedResult = 'AUS';
        expect(service['getValueFromComponentVal'](value)).toEqual(expectedResult);
      });
      it('should return parsed JSON, if arg is JSON-stringified array', () => {
        const value = '[{"id": "AUS", "label":"Австралия"},{"id": "RUS", "label":"Россия"}]';
        const expectedResult = [
          { id: 'AUS', label: 'Австралия' },
          { id: 'RUS', label: 'Россия' },
        ];
        expect(service['getValueFromComponentVal'](value)).toEqual(expectedResult);
      });
      it('should return array of ids when multichoice dictionary value present', () => {
        const value: string = JSON.stringify({
          amount: 2,
          list: [
            { id: 1, text: '123213', originalItem: {}},
            { id: 2, text: 'gfsd', originalItem: {}},
          ]
        });

        expect(service['getValueFromComponentVal'](value)).toStrictEqual([
          { id: 1, text: '123213', originalItem: {}},
          { id: 2, text: 'gfsd', originalItem: {}},
        ]);
      });
    });

    describe('isValueEquals()', () => {
      it('should return false, if value is empty and componentValue is not empty', () => {
        expect(service.isValueEquals('', { id: 'value' })).toBe(false);
      });
      it('should return true, if value is not empty and componentValue is not empty', () => {
        expect(service.isValueEquals('*', { id: 'value' })).toBe(true);
      });
      it('should return true, if value is array and some items equals to componentValue', () => {
        expect(service.isValueEquals(['value', 'non_value'], { id: 'value' })).toBe(true);
      });
      it('should return false, if value is array and none items are equal to componentValue', () => {
        expect(service.isValueEquals(['values', 'non_value'], { id: 'value' })).toBe(false);
      });
      it('should return true, if value is string and componentValue has equal string', () => {
        expect(service.isValueEquals('value', { id: 'value' })).toBe(true);
      });
      it('should return true, if componentValue is JSON array and some items equals to value', () => {
        const componentVal = '[{"id": "AUS", "label":"Австралия"},{"id": "RUS", "label":"Россия"}]';
        expect(service.isValueEquals('RUS', componentVal)).toBe(true);
      });
      it('should return false, if componentValue is JSON array and none items are equal to value', () => {
        const componentVal = '[{"id": "AUS", "label":"Австралия"},{"id": "RUS", "label":"Россия"}]';
        expect(service.isValueEquals('JAP', componentVal)).toBe(false);
      });
      it('should return true, if componentValue is JSON array and some items equals to one of the', () => {
        const componentVal = '[{"id": "AUS", "label":"Австралия"},{"id": "RUS", "label":"Россия"}]';
        expect(service.isValueEquals(['RUS', 'JAP'], componentVal)).toBe(true);
      });
      it('should return false, if componentValue is JSON array and none items are equal to one of the', () => {
        const componentVal = '[{"id": "AUS", "label":"Австралия"},{"id": "RUS", "label":"Россия"}]';
        expect(service.isValueEquals(['JAP', 'TUR'], componentVal)).toBe(false);
      });
      it('should return true, if componentValue is multichoice dictionary', () => {
        const componentVal = '{ amount: 2, list: [ { id: 1 }, { id: 2 }, ] }';
        expect(service.isValueEquals('14685', componentVal)).toBe(false);
      });
    });
  });
});
