import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl } from '@angular/forms';
import { AnimationBuilder } from '@angular/animations';
import { Align, ValidationShowOn, MonthYear } from 'epgu-lib';
import * as moment_ from 'moment';

import { ConstructorMonthPickerComponent } from './constructor-month-picker.component';
import { CoreModule } from '../../../core/core.module';

const moment = moment_;
describe('ConstructorMonthPickerComponent', () => {
  let component: ConstructorMonthPickerComponent;
  let fixture: ComponentFixture<ConstructorMonthPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorMonthPickerComponent],
      imports: [CoreModule, RouterTestingModule],
      providers: [AnimationBuilder],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorMonthPickerComponent);
    component = fixture.componentInstance;
    component.id = '123';
    component.control = new FormControl();
    component.minMonth = MonthYear.fromDate(moment().startOf('year').toDate());
    component.maxMonth = MonthYear.fromDate(moment().endOf('year').toDate());
    component.invalid = false;
    component.validationShowOn = ValidationShowOn.IMMEDIATE;
    component.hideTillNowAvailable = true;
    component.align = Align.ADJUST;
    fixture.detectChanges();
  });

  // it('should create', () => {
    // expect(component).toBeTruthy();
  // });
});
