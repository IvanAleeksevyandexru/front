import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeHistoryFormService } from './employee-history.form.service';
import { UnsubscribeService, UnsubscribeServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { EmployeeHistoryMonthsService } from './employee-history.months.service';
import { EmployeeHistoryDataSourceService } from './employee-history.data-source.service';
import { EmployeeHistoryDataSourceServiceStub } from './employee-history.data-source.service.stub';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { EmployeeHistoryModel } from '../employee-history.types';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { Gender } from '@epgu/epgu-constructor-types';
import { PrepareComponentsService } from '../../../../../shared/services/prepare-components/prepare-components.service';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { MockProvider } from 'ng-mocks';
import { DeclinePipe } from '@epgu/ui/pipes';
import { MonthYear } from '@epgu/ui/models/date-time';

describe('EmployeeHistoryFormService', () => {
  let service: EmployeeHistoryFormService;
  let monthsService: EmployeeHistoryMonthsService;
  let ds: EmployeeHistoryDataSourceService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        EmployeeHistoryFormService,
        MockProvider(EmployeeHistoryMonthsService),
        MockProvider(DatesToolsService),
        MockProvider(PrepareComponentsService),
        MockProvider(ConfigService),
        MockProvider(LoggerService),
        MockProvider(DeclinePipe),
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
        { provide: EmployeeHistoryDataSourceService, useClass: EmployeeHistoryDataSourceServiceStub },
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
