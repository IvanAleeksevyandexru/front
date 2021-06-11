import { TestBed } from '@angular/core/testing';

import { UnsubscribeService } from './unsubscribe.service';

describe('UnsubscribeService', () => {
  let service: UnsubscribeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnsubscribeService],
    });
    service = TestBed.inject(UnsubscribeService);
  });

  it('test destroy', () => {
    service.ngOnDestroy();
    expect(service.ngUnsubscribe$.isStopped).toBe(true);
  });
});
