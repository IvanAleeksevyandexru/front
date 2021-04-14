import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';
import { FormBuilder } from '@angular/forms';

import { MatPeriodFormComponent } from './mat-period-form.component';
import { ConstructorDropdownModule } from '../../../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ConstructorDatePickerModule } from '../../../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ErrorModule } from '../../../../../../shared/components/error/error.module';
import { ConstructorPlainInputModule } from '../../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMaskedInputModule } from '../../../../../../shared/components/constructor-masked-input/constructor-masked-input.module';
import { BaseModule } from '../../../../../../shared/base.module';
import { MemoModule } from '../../../../../../shared/pipes/memo/memo.module';
import { FilterPipe } from '../../pipe/filter.pipe';
import { DurationService } from '../../service/duration.service';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { ValidationService } from '../../../../../../shared/services/validation/validation.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { DateRangeService } from '../../../../../../shared/services/date-range/date-range.service';
import { LabelPipe } from '../../pipe/label.pipe';
import { configureTestSuite } from 'ng-bullet';

describe('MatPeriodFormComponent', () => {
  let component: MatPeriodFormComponent;
  let fixture: ComponentFixture<MatPeriodFormComponent>;
  const mockCachedValue = {
    paymentType: 'month',
    amount: '2,00',
    startPayment: { text: 'декабрь 2020', id: 0, date: '01.12.2020', value: 0 },
    finishPayment: { text: 'январь 2021', id: 1, date: '01.01.2021', value: 1 },
    paymentDate: '23.12.2020',
  };
  const mockComponents = {
    paymentType: {
      attrs: {},
      label: {
        one: 'Единовременно',
        month: 'Ежемесячный платеж',
        quarter: 'Ежеквартальный платеж',
        halfYear: 'Полугодовой платеж',
        year: 'Ежегодный платеж',
      },
    },
    amount: {
      attrs: {
        maskOptions: {
          decimalSymbol: ',',
          allowDecimal: true,
        },
        validation: [
          {
            type: 'RegExp',
            value: '^.{0,5}$',
            errorMsg: 'Максимальная длина поля 5 символов',
          },
        ],
      },
      label: 'amount',
    },
    startPayment: {
      label: 'startPayment',
    },
    finishPayment: {
      label: 'finishPayment',
    },
    paymentDate: {
      attrs: {
        validation: [],
      },
      label: 'paymentDate',
    },
  };
  const mockFormValue = {
    paymentType: 'month',
    amount: '2,00',
    startPayment: { text: 'декабрь 2020', id: 0, date: '01.12.2020', value: 0 },
    finishPayment: { text: 'январь 2021', id: 1, date: '01.01.2021', value: 1 },
    paymentDate: '23',
  };
  let validationService: ValidationService;
  configureTestSuite( () => {
    TestBed.configureTestingModule({
      declarations: [MatPeriodFormComponent, FilterPipe, LabelPipe],
      imports: [
        MockModule(ConstructorDropdownModule),
        MockModule(ConstructorDatePickerModule),
        MockModule(BaseComponentsModule),
        MockModule(ConstructorPlainInputModule),
        MockModule(ConstructorMaskedInputModule),
        MockModule(ErrorModule),
        MockModule(BaseModule),
        MockModule(MemoModule),
      ],
      providers: [
        FormBuilder,
        DurationService,
        DatesToolsService,
        ValidationService,
        DateRangeService,
        { provide: ScreenService, use: ScreenServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatPeriodFormComponent);
    validationService = TestBed.inject(ValidationService);
    component = fixture.componentInstance;
    component.cachedValue = {} as any;
    component.components = mockComponents as any;
    fixture.detectChanges();
  });

  describe('init form', () => {
    it('should be init form', () => {
      const expectedFormValue = {
        paymentType: 'one',
        amount: null,
        startPayment: null,
        finishPayment: null,
        paymentDate: null,
      };
      expect(component.form.value).toEqual(expectedFormValue);
    });

    it('should be init form with cashedValue', () => {
      component.cachedValue = mockCachedValue as any;
      fixture.detectChanges();
      component.ngOnInit();
      const expectedFormValue = {
        paymentType: 'month',
        amount: '2,00',
        startPayment: { text: 'декабрь 2020', id: 0, date: '01.12.2020', value: 0 },
        finishPayment: { text: 'январь 2021', id: 1, date: '01.01.2021', value: 1 },
        paymentDate: '23.12.2020',
      };
      expect(component.form.value).toEqual(expectedFormValue);
    });
  });

  it('should be call updateStateEvent with value', () => {
    const expectedParams = {
      data: {
        paymentType: 'month',
        amount: '2,00',
        startPayment: { text: 'декабрь 2020', id: 0, date: '01.12.2020', value: 0 },
        finishPayment: { text: 'январь 2021', id: 1, date: '01.01.2021', value: 1 },
        paymentDate: '23.12.2020',
      },
      isValid: true,
    };
    jest.spyOn(component.updateStateEvent, 'emit');
    component.form.setValue(mockFormValue);
    expect(component.updateStateEvent.emit).toHaveBeenLastCalledWith(expectedParams);
  });

  it('should be update field startPayment, finishPayment, paymentDate after paymentType change', () => {
    const expectedData = {
      paymentType: 'one',
      amount: '2,00',
      startPayment: null,
      paymentDate: null,
    };
    component.form.setValue(mockFormValue);
    component.form.get('paymentType').setValue('one');
    expect(component.form.value).toEqual(expectedData);
  });

  it('should be change validation paymentDate after paymentType change', () => {
    jest.spyOn(validationService, 'customValidator');
    component.form.setValue(mockFormValue);
    expect(validationService.customValidator).toHaveBeenCalled();
  });

  describe('startPayment form field', () => {
    it('should be set null and enable finishPayment field', () => {
      component.form.setValue(mockFormValue);
      component.form
        .get('startPayment')
        .setValue({ text: 'декабрь 2021', id: 0, date: '01.12.2021', value: 0 });
      const finishPaymentControl = component.form.get('finishPayment');
      expect(finishPaymentControl.value).toBeNull();
      expect(finishPaymentControl.disabled).toBeFalsy();
    });

    it('should be set null and disable finishPayment field', () => {
      component.form.setValue(mockFormValue);
      component.form.get('startPayment').setValue(null);
      const finishPaymentControl = component.form.get('finishPayment');
      expect(finishPaymentControl.value).toBeNull();
      expect(finishPaymentControl.disabled).toBeTruthy();
    });
  });
});
