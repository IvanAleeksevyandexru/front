import { ValidationTypeModule } from './../../directives/validation-type/validation-type.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockModule } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConstructorDatePickerComponent } from './constructor-date-picker.component';
import { BaseModule } from '../../base.module';
import { MonthYear } from '@epgu/ui/models/date-time';

describe('ConstructorDatePickerComponent', () => {
  let component: ConstructorDatePickerComponent;
  let fixture: ComponentFixture<ConstructorDatePickerComponent>;
  let debugEl: DebugElement;
  const selector = 'lib-date-picker';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructorDatePickerComponent],
      imports: [
        MockModule(BaseModule),
        MockModule(ValidationTypeModule),
        RouterTestingModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorDatePickerComponent);
    const dateMock = new MonthYear(1, 2021);
    jest.spyOn(MonthYear, 'fromDate').mockReturnValue(dateMock);
    component = fixture.componentInstance;
    component.invalid = false;
    component.control = new FormControl();
    component.readOnly = true;
    component.minDate = '01.01.2012';
    component.maxDate = '02.04.2016';
    component.align = 'left';
    component.clearable = false;
    component.disabled = false;
    component.name = 'name';
    fixture.detectChanges();
    debugEl = fixture.debugElement.query(By.css(selector));
  });

  it('should be trigger dateSelected', () => {
    const date = new Date();
    jest.spyOn(component.dateSelectedEvent, 'emit');
    debugEl.triggerEventHandler('dateSelected', date);
    expect(component.dateSelectedEvent.emit).toHaveBeenCalledWith(date);
  });

  it('should be trigger cleared', () => {
    jest.spyOn(component.clearedEvent, 'emit');
    debugEl.triggerEventHandler('cleared', {});
    expect(component.clearedEvent.emit).toHaveBeenCalled();
  });

  it('should be trigger blur', () => {
    jest.spyOn(component.blurEvent, 'emit');
    debugEl.triggerEventHandler('blur', {});
    expect(component.blurEvent.emit).toHaveBeenCalled();
  });

  it('should be trigger change', () => {
    const date = new Date('01.01.2021');
    jest.spyOn(component.dateSelectedEvent, 'emit');
    const event = { target: { value: '01.01.2021' }};
    debugEl.triggerEventHandler('change', event);
    expect(component.dateSelectedEvent.emit).toHaveBeenCalledWith(date);
  });

  describe('input event', () => {
    it('should call date selected event when input is correct', () => {
      const event = { target: { value: '01.01.2021' }};
      const date = new Date('01.01.2021');
      jest.spyOn(component.dateSelectedEvent, 'emit');
      debugEl.triggerEventHandler('input', event);
      expect(component.dateSelectedEvent.emit).toHaveBeenCalledWith(date);
    });

    it('should do nothing if date isnt full', () => {
      const event = { target: { value: '01.01.____' }};
      jest.spyOn(component.dateSelectedEvent, 'emit');
      debugEl.triggerEventHandler('input', event);
      expect(component.dateSelectedEvent.emit).not.toHaveBeenCalled();
    });
  });
});
