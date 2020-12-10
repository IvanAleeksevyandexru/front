import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConstructorMonthPickerComponent } from './constructor-month-picker.component';
import { CoreModule } from '../../../core/core.module';
import { FormControl } from '@angular/forms';
import { MonthYear } from 'epgu-lib/lib/models/date-time.model';
import { Align, ValidationShowOn } from 'epgu-lib';

describe('ConstructorMonthPickerComponent', () => {
  let component: ConstructorMonthPickerComponent;
  let fixture: ComponentFixture<ConstructorMonthPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorMonthPickerComponent],
      imports: [CoreModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorMonthPickerComponent);
    component = fixture.componentInstance;
    component.id = '123';
    component.control = new FormControl();
    component.minMonth = {} as MonthYear;
    component.maxMonth = {} as MonthYear;
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
