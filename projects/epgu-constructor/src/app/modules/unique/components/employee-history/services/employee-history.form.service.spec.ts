import { TestBed } from '@angular/core/testing';

import { EmployeeHistoryFormService } from './employee-history.form.service';

describe('EmployeeHistory.FormService', () => {
  let service: EmployeeHistoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeHistoryFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
