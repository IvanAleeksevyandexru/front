import { TestBed } from '@angular/core/testing';

import { EpguConstructorService } from './epgu-constructor.service';

describe('EpguConstructorService', () => {
  let service: EpguConstructorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpguConstructorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
