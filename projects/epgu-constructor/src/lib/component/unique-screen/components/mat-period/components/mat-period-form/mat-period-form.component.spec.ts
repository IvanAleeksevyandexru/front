import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockModule, MockProvider } from 'ng-mocks';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MatPeriodFormComponent } from './mat-period-form.component';
import {
  ConstructorDropdownModule,
  ErrorModule,
  MemoModule,
  DatesToolsService,
  ConfigService,
  ActivatedRouteStub,
  DatesToolsServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ConstructorDatePickerModule } from '../../../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ConstructorPlainInputModule } from '../../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMaskedInputModule } from '../../../../../../shared/components/constructor-masked-input/constructor-masked-input.module';
import { BaseModule } from '../../../../../../shared/base.module';
import { FilterPipe } from '../../pipe/filter.pipe';
import { DurationService } from '../../service/duration.service';
import { DurationServiceStub } from '../../service/duration.service.stub';
import { ValidationService } from '../../../../../../shared/services/validation/validation.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { LabelPipe } from '../../pipe/label.pipe';
import { DateRestrictionsService } from '../../../../../../shared/services/date-restrictions/date-restrictions.service';
import { HttpClientModule } from '@angular/common/http';

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
  beforeEach(() => {
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
        HttpClientModule,
      ],
      providers: [
        FormBuilder,
        { provide: ScreenService, use: ScreenServiceStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: DurationService, useClass: DurationServiceStub },
        MockProvider(DateRestrictionsService),
        MockProvider(ValidationService),
        MockProvider(ConfigService),
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
    it('should be init form', async () => {
      const expectedFormValue = {
        paymentType: 'one',
        amount: null,
        startPayment: null,
        finishPayment: null,
        paymentDate: null,
      };
      await waitForAsync(() => {
        expect(component.form.value).toEqual(expectedFormValue);
      });
    });

    it('should be init form with cashedValue', async () => {
      const expectedFormValue = {
        paymentType: 'month',
        amount: '2,00',
        startPayment: { text: 'декабрь 2020', id: 0, date: '01.12.2020', value: 0 },
        finishPayment: { text: 'январь 2021', id: 1, date: '01.01.2021', value: 1 },
        paymentDate: '23.12.2020',
      };
      await waitForAsync(() => {
        component.cachedValue = mockCachedValue as any;
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.form.value).toEqual(expectedFormValue);
      });
    });
  });

  it('should be call updateStateEvent with value', async () => {
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
    await waitForAsync(() => {
      jest.spyOn(component.updateStateEvent, 'emit');
      component.form.setValue(mockFormValue);
      expect(component.updateStateEvent.emit).toHaveBeenLastCalledWith(expectedParams);
    });
  });

  it('should be update field startPayment, finishPayment, paymentDate after paymentType change', async () => {
    const expectedData = {
      paymentType: 'one',
      amount: '2,00',
      startPayment: null,
      paymentDate: null,
    };
    await waitForAsync(() => {
      component.form.setValue(mockFormValue);
      component.form.get('paymentType').setValue('one');
      expect(component.form.value).toEqual(expectedData);
    });
  });

  it('should be change validation paymentDate after paymentType change', async () => {
    await waitForAsync(() => {
      jest.spyOn(validationService, 'customValidator');
      component.form.setValue(mockFormValue);
      expect(validationService.customValidator).toHaveBeenCalled();
    });
  });

  describe('startPayment form field', () => {
    it('should be set null and enable finishPayment field', async () => {
      await waitForAsync(() => {
        component.form.setValue(mockFormValue);
        component.form
          .get('startPayment')
          .setValue({ text: 'декабрь 2021', id: 0, date: '01.12.2021', value: 0 });
        const finishPaymentControl = component.form.get('finishPayment');
        expect(finishPaymentControl.value).toBeNull();
        expect(finishPaymentControl.disabled).toBeFalsy();
      });
    });

    it('should be set null and disable finishPayment field', async () => {
      await waitForAsync(() => {
        component.form.setValue(mockFormValue);
        component.form.get('startPayment').setValue(null);
        const finishPaymentControl = component.form.get('finishPayment');
        expect(finishPaymentControl.value).toBeNull();
        expect(finishPaymentControl.disabled).toBeTruthy();
      });
    });
  });
});
