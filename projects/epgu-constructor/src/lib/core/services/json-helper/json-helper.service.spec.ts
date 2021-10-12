import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { JsonHelperService } from './json-helper.service';

describe('JsonHelperService', () => {
  let service: JsonHelperService;
  let elem: HTMLElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [JsonHelperService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(JsonHelperService);
    elem = document.createElement('div');
    elem.innerHTML = '<h1 data-hidden-id="some-id">Some Title</h1>';
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
