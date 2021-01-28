import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RadioComponent } from 'epgu-lib';
import { MockComponent, MockModule } from 'ng-mocks';
import { ChangeDetectionStrategy } from '@angular/core';
import { MonthYear } from 'epgu-lib';

import { EmployeeHistoryFormComponent } from './employee-history-form.component';
import { ConstructorPlainInputModule } from '../../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMonthPickerModule } from '../../../../../../shared/components/constructor-month-picker/constructor-month-picker.module';
import { ConstructorCheckboxModule } from '../../../../../../shared/components/constructor-checkbox/constructor-checkbox.module';
import { EmployeeHistoryFormService } from '../../services/employee-history.form.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { EmployeeHistoryMonthsService } from '../../services/employee-history.months.service';
import { EmployeeHistoryDataSourceService } from '../../services/employee-history.data-source.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { EmployeeHistoryDescriptionComponent } from '../employee-history-desription/employee-history-description.component';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { CloneButtonModule } from '../../../../../../shared/components/clone-button/clone-button.module';
import { MemoModule } from '../../../../../../shared/pipes/memo/memo.module';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { Gender } from '../../../../../../shared/types/gender';
import { TextTransform } from '../../../../../../shared/types/textTransform';
import { EmployeeHistoryModel } from '../../employee-history.types';

describe('EmployeeHistoryFormComponent', () => {
  let component: EmployeeHistoryFormComponent;
  let fixture: ComponentFixture<EmployeeHistoryFormComponent>;
  let employeeHistoryFormService: EmployeeHistoryFormService;
  let employeeHistoryDataSourceService: EmployeeHistoryDataSourceService;
  let employeeHistoryMonthsService: EmployeeHistoryMonthsService;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeHistoryFormComponent,
        MockComponent(EmployeeHistoryDescriptionComponent),
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
      ],
      providers: [
        FormBuilder,
        EmployeeHistoryFormService,
        UnsubscribeService,
        EmployeeHistoryDataSourceService,
        EmployeeHistoryMonthsService,
        EventBusService,
        DatesToolsService,
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
        placeHint: 'Как в дипломе или аттестате',
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
        {
          address: 'test',
          checkboxToDate: true,
          error: null,
          from: { month: 1, monthCode: 'FEBRUARY', year: 2016 },
          label: 'Я учился',
          minDateTo: { month: 1, monthCode: 'FEBRUARY', year: 2016 },
          place: 'test',
          position: '',
          to: { month: 1, monthCode: 'FEBRUARY', year: 2021 },
          type: 'student',
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
