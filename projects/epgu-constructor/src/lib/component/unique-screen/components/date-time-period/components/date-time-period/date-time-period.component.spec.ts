import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponents, MockProvider } from 'ng-mocks';
import {
  DatesToolsServiceStub,
  ConfigService,
  ConfigServiceStub,
  ConstructorDropdownComponent,
  DatesToolsService,
  InputErrorComponent,
  ScreenPadComponent,
  HealthService,
} from '@epgu/epgu-constructor-ui-kit';
import {
  AbstractControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';

import {
  ComponentAttrsDto,
  ComponentDateTimeDto,
  ComponentDto,
} from '@epgu/epgu-constructor-types';
import { ListElement } from '@epgu/ui/models/dropdown';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { addDays, addYears } from 'date-fns';
import { DateRefService } from '../../../../../../core/services/date-ref/date-ref.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { DateRangeService } from '../../../../../../shared/services/date-range/date-range.service';
import { DateRestrictionsService } from '../../../../../../shared/services/date-restrictions/date-restrictions.service';
import { ValidationService } from '../../../../../../shared/services/validation/validation.service';
import { DateTimePeriodComponent } from './date-time-period.component';
import { getDateTimeObject } from '../../utils/date-time-period.utils';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { LabelComponent } from '../../../../../../shared/components/base-components/label/label.component';
import { ConstructorDatePickerComponent } from '../../../../../../shared/components/constructor-date-picker/constructor-date-picker.component';

const timeDropdownItems: ListElement[] = [];
for (let i = 0; i < 24; i++) {
  const hour = i < 10 ? `0${i}` : i;
  const objHour = [
    { id: `${hour}:00`, text: `${hour}:00` },
    { id: `${hour}:15`, text: `${hour}:15` },
    { id: `${hour}:30`, text: `${hour}:30` },
    { id: `${hour}:45`, text: `${hour}:45` },
  ];
  timeDropdownItems.push(...objHour);
}

jest.useFakeTimers();

describe('DateTimePeriodComponent', () => {
  let component: DateTimePeriodComponent;
  let fixture: ComponentFixture<DateTimePeriodComponent>;
  let currentAnswersService: CurrentAnswersService;

  const initComponent = () => {
    fixture = TestBed.createComponent(DateTimePeriodComponent);
    component = fixture.componentInstance;
    component.component = ({ attrs: {} } as unknown) as ComponentDto;
    component.attrs = ({ beginDate: {}, endDate: {} } as unknown) as ComponentAttrsDto;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DateTimePeriodComponent,
        MockComponents(
          ScreenPadComponent,
          InputErrorComponent,
          LabelComponent,
          ConstructorDatePickerComponent,
          ConstructorDropdownComponent,
        ),
      ],
      providers: [
        MockProvider(HttpClient),
        MockProvider(ActivatedRoute),
        MockProvider(DateRestrictionsService),
        MockProvider(HealthService),
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        CurrentAnswersService,
        ValidationService,
        ScreenService,
        DateRangeService,
        DatesToolsService,
        DateRefService,
      ],
      imports: [FormsModule, ReactiveFormsModule],
    })
      .overrideComponent(DateTimePeriodComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    initComponent();
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    fixture.detectChanges();
  });

  describe('epgu-cf-ui-constructor-screen-pad', () => {
    const selector = 'epgu-cf-ui-constructor-screen-pad';

    it('should be rendered', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('should pass formGroup', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      const group = debugEl.injector.get(FormGroupDirective).form;
      expect(group).toBeInstanceOf(FormGroup);
      expect(group.get('startDate')).toBeInstanceOf(AbstractControl);
      expect(group.get('startTime')).toBeInstanceOf(AbstractControl);
      expect(group.get('endDate')).toBeInstanceOf(AbstractControl);
      expect(group.get('endTime')).toBeInstanceOf(AbstractControl);
    });
  });
  describe('epgu-cf-ui-constructor-input-error', () => {
    const selector = 'epgu-cf-ui-constructor-input-error';

    it('should be rendered if (startDate.invalid && startDate.touched)', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      // потому что не touched и valid
      expect(debugEl).toBeNull();

      component.group.get('startDate').setValue('');
      component.group.get('startDate').markAsTouched();
      fixture.detectChanges();
      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });

    it('should be rendered if (startTime.invalid && startTime.touched)', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      // потому что не touched и valid
      expect(debugEl).toBeNull();

      component.group.get('startTime').setValue('');
      component.group.get('startTime').markAsTouched();
      fixture.detectChanges();
      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });
  });

  describe('epgu-constructor-label', () => {
    const selector = 'epgu-constructor-label';

    it('should be rendered', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });

    it('label should be empty line if not attrs.beginDate.label', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.label).toBe('');
    });

    it('label should be attrs.beginDate.label', () => {
      component.attrs = {
        beginDate: { label: 'some label text' } as ComponentDateTimeDto,
      };
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.label).toBe('some label text');
    });
  });

  describe('epgu-constructor-label epgu-constructor-constructor-date-picker', () => {
    const label = 'epgu-constructor-label';
    const datePicker = 'epgu-constructor-constructor-date-picker';

    it('attributes for (label) and id (date-picker) should be equal', () => {
      const debugElLabel = fixture.debugElement.queryAll(By.css(label))[0];
      const debugElDatePicker = fixture.debugElement.queryAll(By.css(datePicker))[0];
      expect(debugElDatePicker.nativeElement.id).toBe(debugElLabel.componentInstance.for);
    });
  });

  describe('epgu-constructor-constructor-date-picker', () => {
    const selector = 'epgu-constructor-constructor-date-picker';
    it('minDate should be today', () => {
      component.attrs = {
        beginDate: { minDate: 'today' } as ComponentDateTimeDto,
        endDate: {} as ComponentDateTimeDto,
      };
      fixture.detectChanges();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.componentInstance.minDate).toBe('today');
    });

    it('control should be group.controls.startDate', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      const group = debugEl.injector.get(FormGroupDirective).form;
      expect(debugEl.componentInstance.control).toBe(group.controls.startDate);
    });

    it('maxDate should be attrs.beginDate?.maxDate', () => {
      component.attrs = {
        beginDate: { maxDate: 'some maxDate' } as ComponentDateTimeDto,
      };
      fixture.detectChanges();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.componentInstance.maxDate).toBe('some maxDate');
    });

    it('clearable should be true', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.componentInstance.clearable).toBeTruthy();
    });

    it('invalid should be true if (startDate.invalid && startDate.touched)', () => {
      let debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.componentInstance.invalid).toBeFalsy();

      component.group.get('startDate').setValue('');
      fixture.detectChanges();
      debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.componentInstance.invalid).toBeFalsy();

      component.group.get('startDate').setValue(new Date());
      component.group.get('startDate').markAsTouched();
      fixture.detectChanges();
      debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.componentInstance.invalid).toBeFalsy();

      component.group.get('startDate').setValue('');
      fixture.detectChanges();
      debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.componentInstance.invalid).toBeTruthy();
    });
  });

  describe('epgu-constructor-label 2', () => {
    const selector = 'epgu-constructor-label';

    it('should be rendered', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl).toBeTruthy();
    });

    it('label should be empty line if not attrs.beginDate.label', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.label).toBe('');
    });

    it('label should be attrs.beginTime.label', () => {
      component.attrs = {
        beginDate: {} as ComponentDateTimeDto,
        endDate: {} as ComponentDateTimeDto,
        beginTime: { label: 'some label text 2' } as ComponentDateTimeDto,
      };
      fixture.detectChanges();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.label).toBe('some label text 2');
    });
  });

  describe('epgu-constructor-label2 epgu-cf-ui-constructor-constructor-dropdown', () => {
    const label2 = 'epgu-constructor-label';
    const dropdown = 'epgu-cf-ui-constructor-constructor-dropdown';

    it('attributes for (label2) and id (dropdown) should be equal', () => {
      const debugElLabel = fixture.debugElement.queryAll(By.css(label2))[1];
      const debugElDropdown = fixture.debugElement.queryAll(By.css(dropdown))[0];
      expect(debugElDropdown.componentInstance.id).toBe(debugElLabel.componentInstance.for);
    });
  });

  describe('epgu-cf-ui-constructor-constructor-dropdown', () => {
    const selector = 'epgu-cf-ui-constructor-constructor-dropdown';

    it('items should be startTimeDropdownItems', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      const startTimeDropdownItems = timeDropdownItems;
      expect(debugEl.componentInstance.items).toEqual(startTimeDropdownItems);
    });

    it('control should be group.controls.startTime', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      const group = debugEl.injector.get(FormGroupDirective).form;
      expect(debugEl.componentInstance.control).toEqual(group.controls.startTime);
    });

    it('invalid should be true if (startTime.invalid && startTime.touched)', () => {
      let debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.componentInstance.invalid).toBeFalsy();

      component.group.get('startTime').setValue('');
      fixture.detectChanges();
      debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.componentInstance.invalid).toBeFalsy();

      component.group.get('startTime').setValue(new Date());
      component.group.get('startTime').markAsTouched();
      fixture.detectChanges();
      debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.componentInstance.invalid).toBeFalsy();

      component.group.get('startTime').setValue('');
      fixture.detectChanges();
      debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.componentInstance.invalid).toBeTruthy();
    });
  });

  describe('date-time-period-btns__item', () => {
    const selector = '.date-time-period-btns__item';

    it('setOneDayPeriod()', () => {
      jest.spyOn(component, 'setOneDayPeriod');

      const startTime = { id: '00:00', text: '00:00' };
      const startDate = new Date();

      component.group.get('startTime').setValue(startTime);
      component.group.get('startDate').setValue(startDate);
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[0];

      debugEl.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(component.setOneDayPeriod).toHaveBeenCalled();

      const newStartDate = new Date(startDate);
      newStartDate.setHours(0);
      newStartDate.setMinutes(0);
      const expectedStartDate = addDays(newStartDate, 1);
      expect(component.group.get('endTime').value).toBe(startTime);
      expect(component.group.get('endDate').value).toEqual(expectedStartDate);
    });

    it('setOneYearPeriod()', () => {
      jest.spyOn(component, 'setOneYearPeriod');

      const startTime = { id: '00:00', text: '00:00' };
      const startDate = new Date();

      component.group.get('startTime').setValue(startTime);
      component.group.get('startDate').setValue(startDate);
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];

      debugEl.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(component.setOneYearPeriod).toHaveBeenCalled();

      const expectedStartDate = addYears(
        getDateTimeObject(startDate, startTime.id as string, 'HH:mm'),
        1,
      );
      expect(component.group.get('endTime').value).toBe(startTime);
      expect(component.group.get('endDate').value).toEqual(expectedStartDate);
    });

    it('setOneHundredYearsPeriod()', () => {
      jest.spyOn(component, 'setOneHundredYearsPeriod');

      const startTime = { id: '23:45', text: '23:45' };
      const startDate = new Date();

      component.group.get('startTime').setValue(startTime);
      component.group.get('startDate').setValue(startDate);
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[2];

      debugEl.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(component.setOneHundredYearsPeriod).toHaveBeenCalled();

      const expectedStartDate = addYears(
        getDateTimeObject(startDate, startTime.id as string, 'HH:mm'),
        100,
      );
      expect(component.group.get('endTime').value).toBe(startTime);
      expect(component.group.get('endDate').value).toEqual(expectedStartDate);
    });
  });

  describe('epgu-cf-ui-constructor-input-error 2', () => {
    const selector = 'epgu-cf-ui-constructor-input-error';

    it('should be rendered if (endDate.invalid && endDate.touched)', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      // потому что не touched и valid
      expect(debugEl).toBeNull();

      component.group.get('endDate').setValue('');
      component.group.get('endDate').markAsTouched();
      fixture.detectChanges();
      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });

    it('should be rendered if (endTime.invalid && endTime.touched)', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      // потому что не touched и valid
      expect(debugEl).toBeNull();

      component.group.get('endTime').setValue('');
      component.group.get('endTime').markAsTouched();
      fixture.detectChanges();
      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });
  });

  describe('epgu-constructor-label 3 (endDate))', () => {
    const selector = 'epgu-constructor-label';

    it('should be rendered', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[2];
      expect(debugEl).toBeTruthy();
    });

    it('label should be empty line if not attrs.endDate.label', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[2];
      expect(debugEl.componentInstance.label).toBe('');
    });

    it('label should be attrs.endDate.label', () => {
      component.attrs = {
        beginDate: {} as ComponentDateTimeDto,
        endDate: { label: 'some label text 3' } as ComponentDateTimeDto,
      };
      fixture.detectChanges();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[2];
      expect(debugEl.componentInstance.label).toBe('some label text 3');
    });
  });

  describe('epgu-constructor-label3 epgu-constructor-constructor-date-picker', () => {
    const label3 = 'epgu-constructor-label';
    const datePicker = 'epgu-constructor-constructor-date-picker';

    it('attributes for (label3) and id (date-picker2) should be equal', () => {
      const debugElLabel = fixture.debugElement.queryAll(By.css(label3))[2];
      const debugElDatePicker = fixture.debugElement.queryAll(By.css(datePicker))[1];
      expect(debugElDatePicker.nativeElement.id).toBe(debugElLabel.componentInstance.for);
    });
  });

  describe('epgu-constructor-constructor-date-picker 2 (endDate)', () => {
    const selector = 'epgu-constructor-constructor-date-picker';

    it('minDate should be group.controls.startDate.value', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      const group = debugEl.injector.get(FormGroupDirective).form;
      expect(debugEl.componentInstance.minDate).toBe(group.controls.startDate.value);
    });

    it('maxDate should be attrs.endDate?.maxDate', () => {
      component.attrs = {
        beginDate: {} as ComponentDateTimeDto,
        endDate: { maxDate: 'some maxDate 2' } as ComponentDateTimeDto,
      };
      fixture.detectChanges();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.maxDate).toBe('some maxDate 2');
    });

    it('control should be group.controls.endDate', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      const group = debugEl.injector.get(FormGroupDirective).form;
      expect(debugEl.componentInstance.control).toEqual(group.controls.endDate);
    });

    it('clearable should be true', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.clearable).toBeTruthy();
    });

    it('invalid should be true if (endDate.invalid && endDate.touched)', () => {
      let debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.invalid).toBeFalsy();

      component.group.get('endDate').setValue('');
      fixture.detectChanges();
      debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.invalid).toBeFalsy();

      component.group.get('endDate').setValue(new Date());
      component.group.get('endDate').markAsTouched();
      fixture.detectChanges();
      debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.invalid).toBeFalsy();

      component.group.get('endDate').setValue('');
      fixture.detectChanges();
      debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.invalid).toBeTruthy();
    });
  });

  describe('epgu-constructor-label 4 (endTime))', () => {
    const selector = 'epgu-constructor-label';

    it('should be rendered', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[3];
      expect(debugEl).toBeTruthy();
    });

    it('label should be empty line if not attrs.endTime.label', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[3];
      expect(debugEl.componentInstance.label).toBe('');
    });

    it('label should be attrs.endTime.label', () => {
      component.attrs = {
        beginDate: {} as ComponentDateTimeDto,
        endDate: {} as ComponentDateTimeDto,
        endTime: { label: 'some label text 4' } as ComponentDateTimeDto,
      };
      fixture.detectChanges();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[3];
      expect(debugEl.componentInstance.label).toBe('some label text 4');
    });
  });

  describe('epgu-constructor-label4 epgu-cf-ui-constructor-constructor-dropdown 2', () => {
    const label4 = 'epgu-constructor-label';
    const dropdown = 'epgu-cf-ui-constructor-constructor-dropdown';

    it('attributes for (label4) and id (dropdown2) should be equal', () => {
      const debugElLabel = fixture.debugElement.queryAll(By.css(label4))[3];
      const debugElDropdown = fixture.debugElement.queryAll(By.css(dropdown))[1];
      expect(debugElDropdown.componentInstance.id).toBe(debugElLabel.componentInstance.for);
    });
  });

  describe('epgu-cf-ui-constructor-constructor-dropdown 2 (endTime)', () => {
    const selector = 'epgu-cf-ui-constructor-constructor-dropdown';
    it('items should be endTimeDropdownItems', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      const endTimeDropdownItems = timeDropdownItems;
      expect(debugEl.componentInstance.items).toEqual(endTimeDropdownItems);
    });

    it('control should be group.controls.endTime', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      const group = debugEl.injector.get(FormGroupDirective).form;
      expect(debugEl.componentInstance.control).toEqual(group.controls.endTime);
    });

    it('invalid should be true if (endTime.invalid && endTime.touched)', () => {
      let debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.invalid).toBeFalsy();

      component.group.get('endTime').setValue(new Date());
      fixture.detectChanges();
      debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.invalid).toBeFalsy();

      component.group.get('endTime').setValue({ id: '23:45', text: '23:45' });
      component.group.get('endTime').markAsTouched();
      fixture.detectChanges();
      debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.invalid).toBeFalsy();

      component.group.get('endTime').setValue('');
      component.group.get('endTime').markAsTouched();
      fixture.detectChanges();
      debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.invalid).toBeTruthy();
    });
  });

  it('should init start date', () => {
    initComponent();
    component.initialState = {
      startDateTime: '2021-06-21T11:13:36.390Z',
      endDateTime: '2021-06-21T11:13:36.390Z',
    };
    fixture.detectChanges();
    expect(component.group.get('startDate').value.toISOString()).toBe('2021-06-21T11:13:36.390Z');
  });

  describe('getError()', () => {
    const requiredError = 'Не все поля заполнены';

    it('should return required error', () => {
      const res = component.getError({ required: true }, null);
      expect(res).toBe(requiredError);
    });

    it('should return required error', () => {
      const res = component.getError(null, { required: true });
      expect(res).toBe(requiredError);
    });

    it('should return msg error', () => {
      const res = component.getError(null, { msg: 'true' });
      expect(res).toBe('true');
    });
  });
});
