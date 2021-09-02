import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MockModule } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import { addDays, format } from 'date-fns';
import { DefaultUniqueScreenWrapperModule } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import {
  ConfigService,
  ConfigServiceStub,
  DatesToolsService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { DatePeriodComponent } from './date-period.component';
import { Hints } from 'projects/epgu-constructor-types/src/base';

describe('DatePeriodComponent', () => {
  let component: DatePeriodComponent;
  let fixture: ComponentFixture<DatePeriodComponent>;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [DatePeriodComponent],
      imports: [
        MockModule(DefaultUniqueScreenWrapperModule),
        ReactiveFormsModule,
        FormsModule,
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
    spyOn(component.updateState, 'emit');

    const startDate: Date = new Date();
    const endDate: Date = addDays(startDate, 30);
    component.initialState = {
      startDate: startDate,
      endDate: endDate,
    };
    fixture.detectChanges();

    expect(component.updateState.emit).toHaveBeenCalledWith({
      ...component.initialState,
      isValid: true,
    });
  });

  it('should create formgroup', () => {
    const dateFormat = 'dd.MM.yyyy';
    const startDate: Date = new Date();
    const endDate: Date = addDays(startDate, 30);
    component.initialState = {
      startDate: startDate,
      endDate: endDate,
    };
    fixture.detectChanges();

    expect(format(component.group.controls.startDate.value, dateFormat)).toEqual(format(startDate, dateFormat));
    expect(format(component.group.controls.endDate.value, dateFormat)).toEqual(format(endDate, dateFormat));
  });

  it('should rendered correctly', () => {
    const dateFormat = 'dd.MM.yyyy';
    const startDate: Date = new Date();
    const endDate: Date = addDays(startDate, 30);
    const maxDate: Date = addDays(startDate, 90);
    component.initialState = {
      startDate: startDate,
      endDate: endDate,
    };
    component.attrs.hints = [
      {
        label: 'label',
        amount: 1,
        unit: 'days',
      } as Hints
    ];
    component.attrs.endDate = {
      maxDate: format(maxDate, dateFormat),
      label: 'label',
      sublabel: '',
      valueType: '',
      value: '',
      required: true,
      hidden: false,
    };
    fixture.detectChanges();

    const testEl: HTMLDivElement = fixture.debugElement.query(By.css('.date-time-period-btns__item')).nativeElement as HTMLDivElement;
    expect(testEl).toBeTruthy();
    expect(testEl.innerHTML).toContain('label');
  });
});
