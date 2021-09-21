import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl } from '@angular/forms';
import { MockModule } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ConstructorMonthPickerComponent } from './constructor-month-picker.component';
import { BaseModule } from '../../base.module';
import { configureTestSuite } from 'ng-bullet';
import { MonthYear } from '@epgu/ui/models/date-time';
import { Align, ValidationShowOn } from '@epgu/ui/models/common-enums';

describe('ConstructorMonthPickerComponent', () => {
  let component: ConstructorMonthPickerComponent;
  let fixture: ComponentFixture<ConstructorMonthPickerComponent>;
  let debugEl: DebugElement;
  const selector = 'lib-month-picker';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructorMonthPickerComponent],
      imports: [MockModule(BaseModule), RouterTestingModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorMonthPickerComponent);
    const dateMock = new MonthYear(1, 2021);
    jest.spyOn(MonthYear, 'fromDate').mockReturnValue(dateMock);
    component = fixture.componentInstance;
    component.id = '123';
    component.control = new FormControl();
    component.minMonth = null;
    component.maxMonth = null;
    component.invalid = false;
    component.validationShowOn = ValidationShowOn.IMMEDIATE;
    component.hideTillNowAvailable = true;
    component.align = Align.ADJUST;
    fixture.detectChanges();
    debugEl = fixture.debugElement.query(By.css(selector));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be trigger changed', () => {
    jest.spyOn(component.changeEvent, 'emit');
    debugEl.triggerEventHandler('changed', {});
    expect(component.changeEvent.emit).toHaveBeenCalled();
  });

  it('should be trigger cleared', () => {
    jest.spyOn(component.clearedEvent, 'emit');
    debugEl.triggerEventHandler('cleared', {});
    expect(component.clearedEvent.emit).toHaveBeenCalled();
  });

  it('should be trigger focus', () => {
    jest.spyOn(component.focusEvent, 'emit');
    debugEl.triggerEventHandler('focus', {});
    expect(component.focusEvent.emit).toHaveBeenCalled();
  });

  it('should be trigger blur', () => {
    jest.spyOn(component.blurEvent, 'emit');
    debugEl.triggerEventHandler('blur', {});
    expect(component.blurEvent.emit).toHaveBeenCalled();
  });
});
