import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { TypeHelperService } from './type-helper.service';

describe('TypeHelperService', () => {
  let service: TypeHelperService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        TypeHelperService
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(TypeHelperService);
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
});
