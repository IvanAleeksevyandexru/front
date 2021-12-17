import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MockModule } from 'ng-mocks';
import { addDays, format } from 'date-fns';
import {
  ConfigService,
  ConfigServiceStub,
  DATE_STRING_DOT_FORMAT,
  DatesToolsService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { ComponentDateTimeDto, Hints } from '@epgu/epgu-constructor-types';
import { HttpClientModule } from '@angular/common/http';
import { DatePeriodComponent } from './date-period.component';
import { DefaultUniqueScreenWrapperModule } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';

describe('DatePeriodComponent', () => {
  let component: DatePeriodComponent;
  let fixture: ComponentFixture<DatePeriodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [DatePeriodComponent],
      imports: [
        MockModule(DefaultUniqueScreenWrapperModule),
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
      ],
      providers: [
        DatesToolsService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        UnsubscribeService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePeriodComponent);
    component = fixture.componentInstance;
  });

  it('should emit updateState', () => {
    const spy = jest.spyOn(component.updateState, 'emit');

    const startDate: Date = new Date();
    const endDate: Date = addDays(startDate, 30);
    component.initialState = {
      startDate,
      endDate,
    };
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      ...component.initialState,
      isValid: true,
    });
  });

  it('should set beginMaxDate', () => {
    const startDate: Date = new Date();
    const endDate: Date = addDays(startDate, 30);
    component.attrs.beginDate = ({
      maxDate: format(addDays(startDate, 40), DATE_STRING_DOT_FORMAT),
    } as unknown) as ComponentDateTimeDto;
    component.initialState = {
      startDate,
      endDate,
    };
    fixture.detectChanges();

    component.group.patchValue({ endDate });

    expect(component.beginMaxDate).toEqual(endDate);
  });

  it('should create formgroup', () => {
    const startDate: Date = new Date();
    const endDate: Date = addDays(startDate, 30);
    component.initialState = {
      startDate,
      endDate,
    };
    fixture.detectChanges();

    expect(format(component.group.controls.startDate.value, DATE_STRING_DOT_FORMAT)).toEqual(
      format(startDate, DATE_STRING_DOT_FORMAT),
    );
    expect(format(component.group.controls.endDate.value, DATE_STRING_DOT_FORMAT)).toEqual(
      format(endDate, DATE_STRING_DOT_FORMAT),
    );
  });

  it('should rendered correctly', () => {
    const startDate: Date = new Date();
    const endDate: Date = addDays(startDate, 30);
    const maxDate: Date = addDays(startDate, 90);
    component.initialState = {
      startDate,
      endDate,
    };
    component.attrs.hints = [
      {
        label: 'label',
        amount: 1,
        unit: 'days',
      } as Hints,
    ];
    component.attrs.endDate = {
      maxDate: format(maxDate, DATE_STRING_DOT_FORMAT),
      label: 'label',
      sublabel: '',
      valueType: '',
      value: '',
      required: true,
      hidden: false,
    };
    fixture.detectChanges();

    const testEl: HTMLDivElement = fixture.debugElement.query(
      By.css('.date-time-period-btns__item'),
    ).nativeElement as HTMLDivElement;
    expect(testEl).toBeTruthy();
    expect(testEl.innerHTML).toContain('label');
  });

  describe('hintClick()', () => {
    it('when there is no start date', () => {
      const startDate: Date = new Date();
      const endDate: Date = addDays(startDate, 30);
      const maxDate: Date = addDays(startDate, 90);
      component.initialState = {
        startDate,
        endDate,
      };
      component.attrs.endDate = {
        maxDate: format(maxDate, DATE_STRING_DOT_FORMAT),
        label: 'label',
        sublabel: '',
        valueType: '',
        value: '',
        required: true,
        hidden: false,
      };
      fixture.detectChanges();

      const spy = jest.spyOn(component.group, 'patchValue');
      component.hintClick({ amount: 1, unit: 'days', label: '' });

      expect(spy).toHaveBeenCalledWith({ endDate: addDays(startDate, 1) });
    });

    it('when there is no start date', () => {
      const endDate: Date = addDays(new Date(), 30);
      component.initialState = {
        startDate: null,
        endDate,
      };
      fixture.detectChanges();

      const spy = jest.spyOn(component.group, 'patchValue');
      component.hintClick({ amount: 1, unit: 'days', label: '' });

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
