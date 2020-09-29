import { TestBed } from '@angular/core/testing';

import { EmployeeHistoryDatasourceService } from './employee-history.datasource.service';

describe('EmployeeHistoryDatasourceService', () => {
  let service: EmployeeHistoryDatasourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeHistoryDatasourceService]
    });
    service = TestBed.inject(EmployeeHistoryDatasourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
