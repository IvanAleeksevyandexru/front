import { TestBed } from '@angular/core/testing';

import { Gender } from '@epgu/epgu-constructor-types';
import { EmployeeHistoryDataSourceService } from './employee-history.data-source.service';

describe('EmployeeHistoryDataSourceService', () => {
  let service: EmployeeHistoryDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeHistoryDataSourceService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(EmployeeHistoryDataSourceService);
  });

  it('should be create dataSource', () => {
    service.getDataSourceByGender(Gender.female);
    expect(service.dataSource.length).toBeGreaterThan(0);
  });
});
