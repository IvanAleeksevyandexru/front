import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockModule } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MonthYear } from '@epgu/ui/models/date-time';
import { ConstructorDatePickerComponent } from './constructor-date-picker.component';
import { BaseModule } from '../../base.module';
import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';

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
    const event = { target: { value: '01.01.2021' } };
    debugEl.triggerEventHandler('change', event);
    expect(component.dateSelectedEvent.emit).toHaveBeenCalledWith(date);
  });

  describe('input event', () => {
    it('should call date selected event when input is correct', () => {
      const event = { target: { value: '01.01.2014' } };
      const date = new Date('01.01.2014');
      jest.spyOn(component.dateSelectedEvent, 'emit');
      debugEl.triggerEventHandler('input', event);
      expect(component.dateSelectedEvent.emit).toHaveBeenCalledWith(date);
    });

    it('should do nothing if date is not full', () => {
      const event = { target: { value: '01.01.____' } };
      jest.spyOn(component.dateSelectedEvent, 'emit');
      debugEl.triggerEventHandler('input', event);
      expect(component.dateSelectedEvent.emit).not.toHaveBeenCalled();
    });

    it('should do nothing if date is not in allowable range', () => {
      const eventMax = { target: { value: '01.01.2023' } };
      const eventMin = { target: { value: '01.01.1023' } };
      jest.spyOn(component.dateSelectedEvent, 'emit');
      debugEl.triggerEventHandler('input', eventMax);
      debugEl.triggerEventHandler('input', eventMin);
      expect(component.dateSelectedEvent.emit).not.toHaveBeenCalled();
    });
  });

  describe('isDateInRange()', () => {
    it('should return true if date has in allowable range', () => {
      const date = new Date('01.01.2014');
      const isDateInRange = (component as any).isDateInRange(date);

      expect(isDateInRange).toBeTruthy();
    });

    it('should return false if date has not in allowable range', () => {
      const dateMin = new Date('01.01.2010');
      const dateMax = new Date('01.01.2020');
      const isMinDateInRange = (component as any).isDateInRange(dateMin);
      const isMaxDateInRange = (component as any).isDateInRange(dateMax);

      expect(isMinDateInRange).toBeFalsy();
      expect(isMaxDateInRange).toBeFalsy();
    });
  });
});
