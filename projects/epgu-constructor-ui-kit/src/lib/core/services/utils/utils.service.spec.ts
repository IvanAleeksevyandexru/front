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
});
