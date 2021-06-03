import { TestBed } from '@angular/core/testing';
import { TextTransformService } from './text-transform.service';
import { configureTestSuite } from 'ng-bullet';
import { TextTransform } from '@epgu/epgu-constructor-types';

describe('TextTransformService', () => {
  let service: TextTransformService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        TextTransformService
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(TextTransformService);
  });

  describe('transform', () => {
    it('should transform to all upper', () => {
      const actualValue = service.transform('some string', TextTransform.UPPERCASE);
      const expectedValue = 'SOME STRING';

      expect(actualValue).toEqual(expectedValue);
    });

    it('should transform first letter of each word to upper', () => {
      const actualValue = service.transform('some string', TextTransform.ALL);
      const expectedValue = 'Some String';

      expect(actualValue).toEqual(expectedValue);
    });

    it('should transform first letter of each word to upper separated by hyphen and dash', () => {
      const actualValue = service.transform('some‐string-test', TextTransform.ALL);
      const expectedValue = 'Some‐String-Test';

      expect(actualValue).toEqual(expectedValue);
    });

    it('should transform first letter to upper', () => {
      const actualValue = service.transform('some string', TextTransform.FIRST);
      const expectedValue = 'Some string';

      expect(actualValue).toEqual(expectedValue);
    });
  });
});
