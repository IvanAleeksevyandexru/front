import { TestBed } from '@angular/core/testing';

import { EmployeeHistoryDataSourceService } from './employee-history.data-source.service';
import { Gender } from '../../../../../shared/types/gender';

describe('EmployeeHistoryDataSourceService', () => {
  let service: EmployeeHistoryDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeHistoryDataSourceService],
    });
    service = TestBed.inject(EmployeeHistoryDataSourceService);
  });

  it('should be create dataSource', () => {
    service.getDataSourceByGender(Gender.female);
    expect(service.dataSource.length).toBeGreaterThan(0);
  });
});
