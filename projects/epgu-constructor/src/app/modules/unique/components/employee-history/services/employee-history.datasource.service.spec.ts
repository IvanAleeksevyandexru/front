import { TestBed } from '@angular/core/testing';

import { EmployeeHistory.DatasourceService } from './employee-history.datasource.service';

describe('EmployeeHistory.DatasourceService', () => {
  let service: EmployeeHistory.DatasourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeHistory.DatasourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
