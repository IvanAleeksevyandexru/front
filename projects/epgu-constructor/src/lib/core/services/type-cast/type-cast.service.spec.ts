import { TestBed } from '@angular/core/testing';

import { TypeCastService } from './type-cast.service';

describe('TypeCastService', () => {
  let service: TypeCastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypeCastService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(TypeCastService);
  });

  describe('toBoolean()', () => {
    it('should return true', () => {
      expect(service.toBoolean(true)).toBeTruthy();
    });

    it('should return false', () => {
      expect(service.toBoolean(false)).toBeFalsy();
    });

    it('should return true', () => {
      expect(service.toBoolean('true')).toBeTruthy();
    });

    it('should return false', () => {
      expect(service.toBoolean('false')).toBeFalsy();
    });
  });
});
