import { TestBed } from '@angular/core/testing';

import { EmployeeHistoryFormService } from './employee-history.form.service';
import { ReactiveFormsModule } from '@angular/forms';
import { UnsubscribeService } from '../../../../../services/unsubscribe/unsubscribe.service';

describe('EmployeeHistoryFormService', () => {
  let service: EmployeeHistoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [UnsubscribeService],
    });
    service = TestBed.inject(EmployeeHistoryFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
