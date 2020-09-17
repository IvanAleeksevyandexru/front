import { TestBed } from '@angular/core/testing';

import { ValidationValueService } from './validation-value.service';

describe('ValidationValueService', () => {
  let service: ValidationValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
