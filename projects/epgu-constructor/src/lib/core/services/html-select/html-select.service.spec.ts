import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { HtmlSelectService } from './html-select.service';

describe('HtmlSelectService', () => {
  let service: HtmlSelectService;
  let elem: HTMLElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        HtmlSelectService
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(HtmlSelectService);
    elem = document.createElement('div');
    elem.innerHTML = '<h1 data-hidden-id="some-id">Some Title</h1>';
  });

  describe('getHiddenBlock()', () => {
    it('should return hidden element', () => {
      expect(service.getHiddenBlock(elem, 'some-id')).toBeTruthy();
    });

    it('should not return empty result', () => {
      expect(service.getHiddenBlock(elem, '42')).toBeFalsy();
    });
  });
});
