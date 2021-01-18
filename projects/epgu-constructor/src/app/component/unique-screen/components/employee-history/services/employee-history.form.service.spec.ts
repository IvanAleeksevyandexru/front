import { TestBed } from '@angular/core/testing';

import { EmployeeHistoryFormService } from './employee-history.form.service';
import { ReactiveFormsModule } from '@angular/forms';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { EmployeeHistoryMonthsService } from './employee-history.months.service';
import { EmployeeHistoryDatasourceService } from './employee-history.datasource.service';
import { DatesToolsService } from '../../../../../core/services/dates-tools/dates-tools.service';

describe('EmployeeHistoryFormService', () => {
  let service: EmployeeHistoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        UnsubscribeService,
        EmployeeHistoryMonthsService,
        EmployeeHistoryFormService,
        EmployeeHistoryDatasourceService,
        DatesToolsService,
      ],
    });
    service = TestBed.inject(EmployeeHistoryFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
