import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl } from '@angular/forms';
import { Align, ValidationShowOn } from 'epgu-lib';

import { ConstructorMonthPickerComponent } from './constructor-month-picker.component';
import { BaseModule } from '../../base.module';
import { CoreModule } from '../../../core/core.module';

xdescribe('ConstructorMonthPickerComponent', () => {
  let component: ConstructorMonthPickerComponent;
  let fixture: ComponentFixture<ConstructorMonthPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorMonthPickerComponent],
      imports: [CoreModule, BaseModule, RouterTestingModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorMonthPickerComponent);
    component = fixture.componentInstance;
    component.id = '123';
    component.control = new FormControl();
    //TODO: заменить minMonth и maxMonth на валидные данные. Некорректно отрабатывает MonthYear
    component.minMonth = null;
    component.maxMonth = null;
    component.invalid = false;
    component.validationShowOn = ValidationShowOn.IMMEDIATE;
    component.hideTillNowAvailable = true;
    component.align = Align.ADJUST;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
