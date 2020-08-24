import { TestBed } from '@angular/core/testing';

import { ScreenComponentService } from './screen-component.service';

describe('ScreenComponentService', () => {
  let service: ScreenComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScreenComponentService]
    });
    service = TestBed.inject(ScreenComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
