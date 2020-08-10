import { TestBed } from '@angular/core/testing';

import { EpguService } from './epgu.service';

describe('EpguService', () => {
  let service: EpguService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpguService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
