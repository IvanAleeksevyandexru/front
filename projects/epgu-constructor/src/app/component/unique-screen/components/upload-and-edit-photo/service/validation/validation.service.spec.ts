import { TestBed } from '@angular/core/testing';

import { Validation.ServiceService } from './validation.service.service';

describe('Validation.ServiceService', () => {
  let service: Validation.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Validation.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
