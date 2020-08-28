import { TestBed } from '@angular/core/testing';

import { EmployeeHistoryFormService } from './employee-history.form.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('EmployeeHistoryFormService', () => {
  let service: EmployeeHistoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule ],
    });
    service = TestBed.inject(EmployeeHistoryFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
