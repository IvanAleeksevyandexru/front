import { TestBed } from '@angular/core/testing';
import { RefRelationService } from './ref-relation.service';
import {
  autofillFromDictionaryRefMock,
  calcRefMock,
  disabledRefMock,
  displayOffRefMock,
  displayOnRefMock, filterOnRefMock,
  getValueRefMock
} from './ref-relation.mock';

describe('RefRelationService', () => {
  let service: RefRelationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RefRelationService
      ],
    });
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
        const result = service.isAutofillFromDictionaryRelation(autofillFromDictionaryRefMock.relation);
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
  });
});
