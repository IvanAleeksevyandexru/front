import { TestBed } from '@angular/core/testing';

import { EmployeeHistoryDataSourceService } from './employee-history-data-source.service';

describe('EmployeeHistoryDataSourceService', () => {
  let service: EmployeeHistoryDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeHistoryDataSourceService],
    });
    service = TestBed.inject(EmployeeHistoryDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
