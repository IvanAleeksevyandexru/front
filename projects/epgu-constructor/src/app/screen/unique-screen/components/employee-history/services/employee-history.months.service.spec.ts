import { TestBed } from '@angular/core/testing';
import { EmployeeHistoryMonthsService } from './employee-history.months.service';

describe('EmployeeHistoryMonthsService', () => {
  let service: EmployeeHistoryMonthsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeHistoryMonthsService]
    });
    service = TestBed.inject(EmployeeHistoryMonthsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
