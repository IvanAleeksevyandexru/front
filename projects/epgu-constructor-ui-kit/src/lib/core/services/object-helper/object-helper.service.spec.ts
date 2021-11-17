import { TestBed } from '@angular/core/testing';

import { ObjectHelperService } from './object-helper.service';

describe('ObjectHelperService', () => {
  let service: ObjectHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObjectHelperService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ObjectHelperService);
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
      expect(
        service.filterIncorrectObjectFields({
          nullProperty: null,
          undefinedProperty: undefined,
          total: 4,
        }),
      ).toEqual({ total: 4 });
    });

    it('shouldn\'t filter fields in all nested objects', () => {
      expect(service.filterIncorrectObjectFields({ nestedObject: { property: null }})).toEqual({
        nestedObject: { property: null },
      });
    });

    it('should return {} if object is {} or []', () => {
      expect(service.filterIncorrectObjectFields([])).toEqual({});
      expect(service.filterIncorrectObjectFields({})).toEqual({});
    });
  });
});
