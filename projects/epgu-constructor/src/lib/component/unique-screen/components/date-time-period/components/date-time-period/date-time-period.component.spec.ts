import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimePeriodComponent } from './date-time-period.component';
import { configureTestSuite } from 'ng-bullet';
import { By } from '@angular/platform-browser';
import { MockComponents } from 'ng-mocks';
import { DatesToolsServiceStub } from 'projects/epgu-constructor-ui-kit/src/lib/core/services/dates-tools/dates-tools.service.stub';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { ConstructorDropdownComponent, DatesToolsService, InputErrorComponent, ScreenPadComponent } from '@epgu/epgu-constructor-ui-kit';
import { LabelComponent } from 'projects/epgu-constructor/src/lib/shared/components/base-components/label/label.component';
import { CurrentAnswersService } from 'projects/epgu-constructor/src/lib/screen/current-answers.service';
import { ConstructorDatePickerComponent } from 'projects/epgu-constructor/src/lib/shared/components/constructor-date-picker/constructor-date-picker.component';
import { ComponentDateTimeDto } from '@epgu/epgu-constructor-types';
import { ListElement } from '@epgu/epgu-lib';
import { addDays, addYears } from 'date-fns';
import { getDateTimeObject } from '../../utils/date-time-period.utils';

const timeDropdownItems: ListElement[] = [];
for (var i = 0; i < 24; i++) {
  const hour = (i < 10) ? '0' + i : i;
  const objHour = [
    { id: hour + ':00', text: hour + ':00' },
    { id: hour + ':15', text: hour + ':15' },
    { id: hour + ':30', text: hour + ':30' },
    { id: hour + ':45', text: hour + ':45' }
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
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ DateTimePeriodComponent,
        MockComponents(ScreenPadComponent, InputErrorComponent, LabelComponent, ConstructorDatePickerComponent, ConstructorDropdownComponent) ],
      providers: [ { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        CurrentAnswersService ],
      imports: [ FormsModule, ReactiveFormsModule ],
    }).overrideComponent(DateTimePeriodComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
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
      //потому что не touched и valid
      expect(debugEl).toBeNull();
      
      component.group.get('startDate').setValue('');
      component.group.get('startDate').markAsTouched();
      fixture.detectChanges();
      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });

    it('should be rendered if (startTime.invalid && startTime.touched)', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      //потому что не touched и valid
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
        beginDate: { label: 'some label text' } as ComponentDateTimeDto
      };
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.label).toBe('some label text');
    });

  });

  describe('epgu-constructor-label epgu-constructor-constructor-date-picker', () => {
    const label = 'epgu-constructor-label';
    const date_picker = 'epgu-constructor-constructor-date-picker';
    
    it ('attributes for (label) and id (date-picker) should be equal', () => {
      const debugEl_label = fixture.debugElement.queryAll(By.css(label))[0];
      const debugEl_date_picker = fixture.debugElement.queryAll(By.css(date_picker))[0];
      expect(debugEl_date_picker.nativeElement.id).toBe(debugEl_label.componentInstance.for);  
    });
  });

  describe('epgu-constructor-constructor-date-picker', () => {
    const selector = 'epgu-constructor-constructor-date-picker';
    it ('minDate should be today', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.componentInstance.minDate).toBe('today');  
    });

    it ('control should be group.controls.startDate', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      const group = debugEl.injector.get(FormGroupDirective).form;
      expect(debugEl.componentInstance.control).toBe(group.controls.startDate);  
    });

    it ('maxDate should be attrs.beginDate?.maxDate', () => {
      
      component.attrs = {
        beginDate: { maxDate: 'some maxDate' } as ComponentDateTimeDto
      };
      fixture.detectChanges();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.componentInstance.maxDate).toBe('some maxDate');  
    });
    
    it ('clearable should be true', () => {
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
        beginTime: { label: 'some label text 2' } as ComponentDateTimeDto
      };
      fixture.detectChanges();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.label).toBe('some label text 2');
    });

  });

  describe('epgu-constructor-label2 epgu-cf-ui-constructor-constructor-dropdown', () => {
    const label2 = 'epgu-constructor-label';
    const dropdown = 'epgu-cf-ui-constructor-constructor-dropdown';
    
    it ('attributes for (label2) and id (dropdown) should be equal', () => {
      const debugEl_label = fixture.debugElement.queryAll(By.css(label2))[1];
      const debugEl_dropdown = fixture.debugElement.queryAll(By.css(dropdown))[0];
      expect(debugEl_dropdown.componentInstance.id).toBe(debugEl_label.componentInstance.for);  
    });
  });

  describe('epgu-cf-ui-constructor-constructor-dropdown', () => {
    const selector = 'epgu-cf-ui-constructor-constructor-dropdown';
    
    it('items should be startTimeDropdownItems', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      const startTimeDropdownItems = timeDropdownItems;
      expect(debugEl.componentInstance.items).toEqual(startTimeDropdownItems);
    });

    it ('control should be group.controls.startTime', () => {
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

      const expectedStartDate = addYears(getDateTimeObject(startDate, startTime.id as string, 'HH:mm'), 1);
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

      const expectedStartDate = addYears(getDateTimeObject(startDate, startTime.id as string, 'HH:mm'), 100);
      expect(component.group.get('endTime').value).toBe(startTime);
      expect(component.group.get('endDate').value).toEqual(expectedStartDate);
    });
  });

  describe('epgu-cf-ui-constructor-input-error 2', () => {
    const selector = 'epgu-cf-ui-constructor-input-error';
    
    it('should be rendered if (endDate.invalid && endDate.touched)', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      //потому что не touched и valid
      expect(debugEl).toBeNull();
      
      component.group.get('endDate').setValue('');
      component.group.get('endDate').markAsTouched();
      fixture.detectChanges();
      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });

    it('should be rendered if (endTime.invalid && endTime.touched)', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      //потому что не touched и valid
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
        endDate: { label: 'some label text 3' } as ComponentDateTimeDto
      };
      fixture.detectChanges();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[2];
      expect(debugEl.componentInstance.label).toBe('some label text 3');
    });

  });

  describe('epgu-constructor-label3 epgu-constructor-constructor-date-picker', () => {
    const label3 = 'epgu-constructor-label';
    const date_picker = 'epgu-constructor-constructor-date-picker';
    
    it ('attributes for (label3) and id (date-picker2) should be equal', () => {
      const debugEl_label = fixture.debugElement.queryAll(By.css(label3))[2];
      const debugEl_date_picker = fixture.debugElement.queryAll(By.css(date_picker))[1];
      expect(debugEl_date_picker.nativeElement.id).toBe(debugEl_label.componentInstance.for);  
    });
  });

  describe('epgu-constructor-constructor-date-picker 2 (endDate)', () => {
    const selector = 'epgu-constructor-constructor-date-picker';
    
    it ('minDate should be group.controls.startDate.value', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      const group = debugEl.injector.get(FormGroupDirective).form;
      expect(debugEl.componentInstance.minDate).toBe(group.controls.startDate.value);  
    });
    
    it ('maxDate should be attrs.endDate?.maxDate', () => {
      
      component.attrs = {
        endDate: { maxDate: 'some maxDate 2' } as ComponentDateTimeDto
      };
      fixture.detectChanges();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.maxDate).toBe('some maxDate 2');  
    });

    it ('control should be group.controls.endDate', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      const group = debugEl.injector.get(FormGroupDirective).form;
      expect(debugEl.componentInstance.control).toEqual(group.controls.endDate);  
    });
    
    it ('clearable should be true', () => {
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
        endTime: { label: 'some label text 4' } as ComponentDateTimeDto
      };
      fixture.detectChanges();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[3];
      expect(debugEl.componentInstance.label).toBe('some label text 4');
    });

  });

  describe('epgu-constructor-label4 epgu-cf-ui-constructor-constructor-dropdown 2', () => {
    const label4 = 'epgu-constructor-label';
    const dropdown = 'epgu-cf-ui-constructor-constructor-dropdown';
    
    it ('attributes for (label4) and id (dropdown2) should be equal', () => {
      const debugEl_label = fixture.debugElement.queryAll(By.css(label4))[3];
      const debugEl_dropdown = fixture.debugElement.queryAll(By.css(dropdown))[1];
      expect(debugEl_dropdown.componentInstance.id).toBe(debugEl_label.componentInstance.for);  
    });
  });

  describe('epgu-cf-ui-constructor-constructor-dropdown 2 (endTime)', () => {
    const selector = 'epgu-cf-ui-constructor-constructor-dropdown';
    it ('items should be endTimeDropdownItems', () => {
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      const endTimeDropdownItems = timeDropdownItems;
      expect(debugEl.componentInstance.items).toEqual(endTimeDropdownItems);
    });

    it ('control should be group.controls.endTime', () => {
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

  it('should set currentAnswersService.isValid is false on init', () => {
    jest.runAllTimers();
    expect(currentAnswersService.isValid).toBe(false);
  });

  it('should init start date', () => {
    initComponent();
    component.initialState = {
      startDateTime: '2021-06-21T11:13:36.390Z',
      endDateTime: '2021-06-21T11:13:36.390Z'
    };
    fixture.detectChanges();
    expect(component.group.get('startDate').value.toISOString()).toBe('2021-06-21T11:13:36.390Z');
  });

});
