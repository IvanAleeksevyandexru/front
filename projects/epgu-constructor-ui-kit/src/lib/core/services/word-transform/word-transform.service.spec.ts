import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { WordTransformService } from './word-transform.service';
import { ObjectHelperService } from '../object-helper/object-helper.service';

describe('WordTransformService', () => {
  let service: WordTransformService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        WordTransformService,
        ObjectHelperService,
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(WordTransformService);
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
});
