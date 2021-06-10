import { TestBed } from '@angular/core/testing';

import { NavigationModalService } from './navigation-modal.service';
import { configureTestSuite } from 'ng-bullet';

describe('NavigationModalService', () => {
  let service: NavigationModalService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [NavigationModalService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(NavigationModalService);
  });

  it('test next', (done) => {
    service.nextStep$.subscribe((v) => {
      expect(v).toBe(null);
      done();
    });
    service.next(null);
  });

  it('test prev', (done) => {
    service.prevStep$.subscribe((v) => {
      expect(v).toBe(null);
      done();
    });
    service.prev(null);
  });
});
