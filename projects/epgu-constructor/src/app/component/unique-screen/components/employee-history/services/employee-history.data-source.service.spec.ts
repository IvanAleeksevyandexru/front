import { TestBed } from '@angular/core/testing';

import { EmployeeHistoryDataSourceService } from './employee-history.data-source.service';
import { Gender } from '../../../../../shared/types/gender';
import { configureTestSuite } from 'ng-bullet';

describe('EmployeeHistoryDataSourceService', () => {
  let service: EmployeeHistoryDataSourceService;

  configureTestSuite(() => {
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
