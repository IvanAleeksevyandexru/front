import { TestBed } from '@angular/core/testing';
import { MonthYear } from 'epgu-lib';
import { ReactiveFormsModule } from '@angular/forms';

import { EmployeeHistoryFormService } from './employee-history.form.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { EmployeeHistoryMonthsService } from './employee-history.months.service';
import { EmployeeHistoryDataSourceService } from './employee-history.data-source.service';
import { DatesToolsService } from '../../../../../core/services/dates-tools/dates-tools.service';
import { EmployeeHistoryModel } from '../employee-history.types';
import { Gender } from '../../../../../shared/types/gender';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

describe('EmployeeHistoryFormService', () => {
  let service: EmployeeHistoryFormService;
  let monthsService: EmployeeHistoryMonthsService;
  let ds: EmployeeHistoryDataSourceService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        UnsubscribeService,
        EmployeeHistoryMonthsService,
        EmployeeHistoryFormService,
        EmployeeHistoryDataSourceService,
        DatesToolsService,
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(EmployeeHistoryFormService);
    monthsService = TestBed.inject(EmployeeHistoryMonthsService);
    ds = TestBed.inject(EmployeeHistoryDataSourceService);
    ds.getDataSourceByGender(Gender.female);
  });

  describe('newGeneration', () => {
    it('should be creat form', () => {
      service.newGeneration();
      expect(service.employeeHistoryForm.length).toBe(1);
    });

    it('should be set defaultType to form', () => {
      service.newGeneration();
      expect(service.employeeHistoryForm.controls[0].get('type').value).toBe('student');
    });

    it('should be update form with cached value', () => {
      const expectedValue = {
        type: 'student',
        from: new MonthYear(3, 2009),
        to: new MonthYear(0, 2021),
        error: null,
        position: null,
        place: '234',
        address: '234',
        checkboxToDate: false,
        minDateTo: new MonthYear(3, 2009),
        label: 'Я учился',
      };
      const generationData: EmployeeHistoryModel = {
        type: 'student',
        label: 'Я учился',
        from: new MonthYear(3, 2009),
        to: new MonthYear(0, 2021),
        place: '234',
        address: '234',
        checkboxToDate: false,
        position: null,
      };

      service.newGeneration(generationData);
      expect(service.employeeHistoryForm.controls[0].value).toEqual(expectedValue);
    });
  });

  describe('removeGeneration', () => {
    it('should be remove form from index', () => {
      service.newGeneration();
      service.removeGeneration(0);
      expect(service.employeeHistoryForm.length).toBe(0);
    });

    it('should be call updateAvailableMonths after remove form', () => {
      jest.spyOn(monthsService, 'updateAvailableMonths');
      service.newGeneration();
      service.removeGeneration(0);
      expect(monthsService.updateAvailableMonths).toHaveBeenCalled();
    });
  });

  describe('clearHistoryForm', () => {
    it('should be clear form', () => {
      service.clearHistoryForm();
      expect(service.employeeHistoryForm.length).toBe(0);
    });
  });
});
