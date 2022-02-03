import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ChangeDetectionStrategy } from '@angular/core';

import { ComponentItemComponent } from '../component-item/component-item.component';

import { MonthPickerComponent } from './month-picker.component';

import { DatesToolsService, DatesToolsServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import MonthPickerModelAttrs from './MonthPickerModelAttrs';

import { ConstructorMonthPickerComponent } from '../../../../shared/components/constructor-month-picker/constructor-month-picker.component';
import { By } from '@angular/platform-browser';
import { MonthYear } from '@epgu/ui/models/date-time';
import { DatesHelperService } from '@epgu/ui/services/dates-helper';

const mockComponent = {
  id: 'mockComponentID',
  attrs: new MonthPickerModelAttrs({ minDate: '-13m', maxDate: '-1m', nonStop: true }),
  value: 'MonthPicker',
  required: false,
};

describe('MonthPickerComponent', () => {
  let component: MonthPickerComponent;
  let fixture: ComponentFixture<MonthPickerComponent>;
  let componentsListFormService: ComponentsListFormService;

  let valueControl: FormControl;
  let control: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MonthPickerComponent,
        MockComponent(ComponentItemComponent),
        MockComponent(ConstructorMonthPickerComponent),
      ],
      imports: [],
      providers: [
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
      ],
    })
      .overrideComponent(MonthPickerComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    componentsListFormService = TestBed.inject(ComponentsListFormService);
    valueControl = new FormControl(mockComponent.value);
    control = new FormGroup({
      id: new FormControl(mockComponent.id),
      attrs: new FormControl(mockComponent.attrs),
      value: valueControl,
      required: new FormControl(mockComponent.required),
    });
    jest.spyOn(componentsListFormService, 'form', 'get').mockReturnValue(new FormArray([control]));
    fixture = TestBed.createComponent(MonthPickerComponent);

    component = fixture.componentInstance;
    component.componentIndex = 0;
  });

  it('should be created element', () => {
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('epgu-constructor-constructor-month-picker')),
    ).not.toBeNull();
  });

  it('should be init minDate and maxDate with years', () => {
    control.controls.attrs.setValue({ ...mockComponent.attrs, years: 5 });
    jest.spyOn(component.monthsService, 'initSettings');
    fixture.detectChanges();

    expect(component.monthsService.years).toBe(5);
    expect(component.monthsService.isNonStop).toBe(true);
    expect(component.monthsService.initSettings).toHaveBeenCalled();
  });

  it('should be init minDate and maxDate not with years', () => {
    fixture.detectChanges();
    const attrs = (control.controls.attrs.value as unknown) as MonthPickerModelAttrs;

    const minMonth = MonthYear.fromDate(DatesHelperService.relativeOrFixedToFixed(attrs?.minDate));
    const maxMonth = MonthYear.fromDate(DatesHelperService.relativeOrFixedToFixed(attrs?.maxDate));

    expect(component.minMonth).toEqual(minMonth);
    expect(component.maxMonth).toEqual(maxMonth);
  });
});
