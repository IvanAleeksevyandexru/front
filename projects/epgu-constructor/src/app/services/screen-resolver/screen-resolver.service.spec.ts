import { TestBed } from '@angular/core/testing';

import { ScreenResolverService } from './screen-resolver.service';

describe('ScreenResolverService', () => {
  let service: ScreenResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScreenResolverService,
      ]
    });
    service = TestBed.inject(ScreenResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
