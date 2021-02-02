import { TestBed } from '@angular/core/testing';

import { ValidationService } from './validation.service';

describe('Validation.ServiceService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationService],
    });
    service = TestBed.inject(ValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
