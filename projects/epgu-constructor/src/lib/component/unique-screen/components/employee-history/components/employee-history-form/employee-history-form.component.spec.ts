import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MockComponents, MockModule, MockProvider } from 'ng-mocks';
import { ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeHistoryFormComponent } from './employee-history-form.component';
import { ConstructorPlainInputModule } from '../../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMonthPickerModule } from '../../../../../../shared/components/constructor-month-picker/constructor-month-picker.module';
import { ConstructorCheckboxModule, MemoModule } from '@epgu/epgu-constructor-ui-kit';
import { EmployeeHistoryFormService } from '../../services/employee-history.form.service';
import { EmployeeHistoryFormServiceStub } from '../../services/employee-history.form.service.stub';
import { UnsubscribeService, ActivatedRouteStub, UnsubscribeServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { EmployeeHistoryMonthsService } from '../../services/employee-history.months.service';
import { EmployeeHistoryMonthsServiceStub } from '../../services/employee-history.months.service.stub';
import { EmployeeHistoryDataSourceService } from '../../services/employee-history.data-source.service';
import { EmployeeHistoryDataSourceServiceStub } from '../../services/employee-history.data-source.service.stub';
import { EventBusService, EventBusServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { EmployeeHistoryDescriptionComponent } from '../employee-history-desription/employee-history-description.component';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { CloneButtonModule } from '../../../../../../shared/components/clone-button/clone-button.module';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { EmployeeHistoryModel } from '../../employee-history.types';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { PrepareComponentsService } from '../../../../../../shared/services/prepare-components/prepare-components.service';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { SuggestHandlerService } from '../../../../../../shared/services/suggest-handler/suggest-handler.service';
import { configureTestSuite } from 'ng-bullet';
import { Gender, TextTransform } from '@epgu/epgu-constructor-types';
import { DateRestrictionsService } from '../../../../../../shared/services/date-restrictions/date-restrictions.service';
import { EmployeeHistoryClarificationComponent } from '../employee-history-clarification/employee-history-clarification.component';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { SuggestMonitorService } from '../../../../../../shared/services/suggest-monitor/suggest-monitor.service';
import { RadioComponent } from '@epgu/ui/controls';
import { MonthYear } from '@epgu/ui/models/date-time';

describe('EmployeeHistoryFormComponent', () => {
  let component: EmployeeHistoryFormComponent;
  let fixture: ComponentFixture<EmployeeHistoryFormComponent>;
  let employeeHistoryFormService: EmployeeHistoryFormService;
  let employeeHistoryDataSourceService: EmployeeHistoryDataSourceService;
  let employeeHistoryMonthsService: EmployeeHistoryMonthsService;
  let datesToolsService: DatesToolsService;

  const MOCK_TODAY = '2021-01-01T00:00:00.000Z';
  const mockComponent = {
    id: 'eh1',
    type: 'EmployeeHistory',
    label: '',
    attrs: { years: 10, nonStop: true },
    linkedValues: [],
    arguments: {},
    value: '',
    required: true,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeHistoryFormComponent,
        MockComponents(EmployeeHistoryDescriptionComponent, EmployeeHistoryClarificationComponent),
        RadioComponent,
      ],
      imports: [
        ReactiveFormsModule,
        MockModule(ConstructorPlainInputModule),
        MockModule(ConstructorMonthPickerModule),
        MockModule(ConstructorCheckboxModule),
        MockModule(BaseComponentsModule),
        MockModule(CloneButtonModule),
        MockModule(MemoModule),
        HttpClientTestingModule,
      ],
      providers: [
        FormBuilder,
        MockProvider(DatesToolsService),
        MockProvider(CurrentAnswersService),
        MockProvider(DeviceDetectorService),
        MockProvider(PrepareComponentsService),
        MockProvider(ConfigService),
        MockProvider(LoggerService),
        MockProvider(SuggestHandlerService),
        MockProvider(DateRestrictionsService),
        MockProvider(SuggestMonitorService),
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
        { provide: EventBusService, useClass: EventBusServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: EmployeeHistoryFormService, useClass: EmployeeHistoryFormServiceStub },
        { provide: EmployeeHistoryDataSourceService, useClass: EmployeeHistoryDataSourceServiceStub },
        { provide: EmployeeHistoryMonthsService, useClass: EmployeeHistoryMonthsServiceStub },
      ],
    })
      .overrideComponent(EmployeeHistoryFormComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    const dateMock = new MonthYear(1, 2021);
    jest.spyOn(MonthYear, 'fromDate').mockReturnValue(dateMock);

    datesToolsService = TestBed.inject(DatesToolsService);
    jest.spyOn(datesToolsService, 'getToday').mockResolvedValue(new Date(MOCK_TODAY));
    employeeHistoryFormService = TestBed.inject(EmployeeHistoryFormService);
    employeeHistoryDataSourceService = TestBed.inject(EmployeeHistoryDataSourceService);
    employeeHistoryMonthsService = TestBed.inject(EmployeeHistoryMonthsService);
    employeeHistoryDataSourceService.getDataSourceByGender(Gender.female);
    fixture = TestBed.createComponent(EmployeeHistoryFormComponent);
    component = fixture.componentInstance;
    component.fstuc = TextTransform.ALL;
    component.init = [mockComponent, Gender.female];
    component.ds = employeeHistoryDataSourceService.dataSource;
    component.componentValue = null;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  describe('availableControlsOfType', () => {
    it('should be return EmployeeHistoryDataSource', () => {
      const expectedResult = {
        label: 'Я училась',
        type: 'student',
        position: '',
        place: 'Место учебы без сокращений и аббревиатур',
        address: 'Юридический адрес полностью, включая регион и город',
      };
      const result = component.availableControlsOfType('student');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('initData', () => {
    it('should be create from', () => {
      expect(employeeHistoryFormService.employeeHistoryForm.controls.length).toBe(1);
    });

    it('should be create from with cached value', () => {
      const componentValueMock: EmployeeHistoryModel[] = [
        {
          type: 'student',
          label: 'Я учился',
          from: new MonthYear(0, 2010),
          to: new MonthYear(0, 2016),
          place: 'test',
          address: 'test',
          checkboxToDate: false,
          position: '',
        },
        {
          type: 'student',
          label: 'Я учился',
          from: new MonthYear(1, 2016),
          to: new MonthYear(0, 2021),
          place: 'test',
          address: 'test',
          checkboxToDate: true,
          position: '',
        },
      ];
      component.componentValue = componentValueMock;
      component.ngOnChanges();
      fixture.detectChanges();
      const expectedValue = [
        {
          type: 'student',
          from: { year: 2010, month: 0, monthCode: 'JANUARY' },
          to: { year: 2016, month: 0, monthCode: 'JANUARY' },
          error: null,
          position: '',
          place: 'test',
          address: 'test',
          checkboxToDate: false,
          minDateTo: { year: 2010, month: 0, monthCode: 'JANUARY' },
          label: 'Я учился',
        },
        {
          type: 'student',
          from: { year: 2016, month: 1, monthCode: 'FEBRUARY' },
          to: { year: 2021, month: 0, monthCode: 'JANUARY' },
          error: null,
          position: '',
          place: 'test',
          address: 'test',
          checkboxToDate: true,
          minDateTo: { year: 2016, month: 1, monthCode: 'FEBRUARY' },
          label: 'Я учился',
        },
      ];

      expect(employeeHistoryFormService.employeeHistoryForm.value).toEqual(expectedValue);
    });
  });

  describe('updateFormEvent', () => {
    it('should be call updateFormEvent', () => {
      jest.spyOn(component.updateFormEvent, 'emit');
      employeeHistoryMonthsService.isMonthComplete$.next(true);
      employeeHistoryFormService.employeeHistoryForm.setValue([
        {
          address: 'test',
          checkboxToDate: false,
          error: null,
          from: { month: 0, monthCode: 'JANUARY', year: 2010 },
          label: 'Я учился',
          minDateTo: { month: 0, monthCode: 'JANUARY', year: 2010 },
          place: 'test',
          position: '',
          to: { month: 0, monthCode: 'JANUARY', year: 2016 },
          type: 'student',
        },
      ]);
      expect(component.updateFormEvent.emit).toHaveBeenCalled();
    });

    it('should be not call updateFormEvent if form change invalid', () => {
      jest.spyOn(component.updateFormEvent, 'emit');
      employeeHistoryMonthsService.isMonthComplete$.next(true);
      expect(component.updateFormEvent.emit).toBeCalledTimes(0);
    });
  });
});
