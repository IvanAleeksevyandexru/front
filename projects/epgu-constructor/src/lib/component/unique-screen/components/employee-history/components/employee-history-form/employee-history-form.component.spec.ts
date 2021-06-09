import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RadioComponent } from '@epgu/epgu-lib';
import { MockComponents, MockModule } from 'ng-mocks';
import { ChangeDetectionStrategy } from '@angular/core';
import { MonthYear } from '@epgu/epgu-lib';

import { EmployeeHistoryFormComponent } from './employee-history-form.component';
import { ConstructorPlainInputModule } from '../../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMonthPickerModule } from '../../../../../../shared/components/constructor-month-picker/constructor-month-picker.module';
import { ConstructorCheckboxModule, MemoModule } from '@epgu/epgu-constructor-ui-kit';
import { EmployeeHistoryFormService } from '../../services/employee-history.form.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { EmployeeHistoryMonthsService } from '../../services/employee-history.months.service';
import { EmployeeHistoryDataSourceService } from '../../services/employee-history.data-source.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { EmployeeHistoryDescriptionComponent } from '../employee-history-desription/employee-history-description.component';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { CloneButtonModule } from '../../../../../../shared/components/clone-button/clone-button.module';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { EmployeeHistoryModel } from '../../employee-history.types';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { DeviceDetectorService } from '../../../../../../core/services/device-detector/device-detector.service';
import { PrepareComponentsService } from '../../../../../../shared/services/prepare-components/prepare-components.service';
import { CachedAnswersService } from '../../../../../../shared/services/cached-answers/cached-answers.service';
import { DictionaryToolsService } from '../../../../../../shared/services/dictionary/dictionary-tools.service';
import { DictionaryApiService } from '../../../../../../shared/services/dictionary/dictionary-api.service';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { LoggerService } from '../../../../../../core/services/logger/logger.service';
import { ComponentsListRelationsService } from '../../../../../custom-screen/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../../../../../shared/services/date-range/date-range.service';
import { RefRelationService } from '../../../../../../shared/services/ref-relation/ref-relation.service';
import { SuggestHandlerService } from '../../../../../../shared/services/suggest-handler/suggest-handler.service';
import { configureTestSuite } from 'ng-bullet';
import { Gender, TextTransform } from '@epgu/epgu-constructor-types';
import { DateRestrictionsService } from '../../../../../../shared/services/date-restrictions/date-restrictions.service';
import { EmployeeHistoryClarificationComponent } from '../employee-history-clarification/employee-history-clarification.component';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';

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
        EmployeeHistoryFormService,
        UnsubscribeService,
        EmployeeHistoryDataSourceService,
        EmployeeHistoryMonthsService,
        EventBusService,
        DatesToolsService,
        ScreenService,
        CurrentAnswersService,
        DeviceDetectorService,
        PrepareComponentsService,
        CachedAnswersService,
        DictionaryToolsService,
        DictionaryApiService,
        ConfigService,
        LoggerService,
        ComponentsListRelationsService,
        DateRangeService,
        RefRelationService,
        SuggestHandlerService,
        DateRestrictionsService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
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
