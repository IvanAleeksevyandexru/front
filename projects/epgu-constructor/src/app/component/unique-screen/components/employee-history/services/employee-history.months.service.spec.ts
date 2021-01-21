import { TestBed } from '@angular/core/testing';
import { DatesToolsService } from '../../../../../core/services/dates-tools/dates-tools.service';
import { EmployeeHistoryMonthsService } from './employee-history.months.service';

describe('EmployeeHistoryMonthsService', () => {
  let service: EmployeeHistoryMonthsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeHistoryMonthsService, DatesToolsService]
    });
    service = TestBed.inject(EmployeeHistoryMonthsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
