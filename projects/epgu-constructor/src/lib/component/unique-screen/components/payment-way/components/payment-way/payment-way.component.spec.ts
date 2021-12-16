import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MockComponents } from 'ng-mocks';
import { PluralizeModule } from '@epgu/ui/pipes';
import { BaseUiModule } from '@epgu/epgu-constructor-ui-kit';
import { PaymentWayComponent } from './payment-way.component';
import { OutputHtmlComponent } from '../../../../../../shared/components/output-html/output-html.component';
import { PaymentTypes, ProgramType } from '../../payment-way.types';

const mockComponents = {
  label: '',
  attrs: {
    paymentWays: [
      {
        paymentType: PaymentTypes.paid,
        amount: 1000,
        programType: ProgramType.other,
      },
    ],
    html: {
      paid: 'fake paid html',
      budget: 'fake budget html',
    },
  },
};

describe('PaymentWayComponent', () => {
  let component: PaymentWayComponent;
  let fixture: ComponentFixture<PaymentWayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentWayComponent, MockComponents(OutputHtmlComponent)],
      imports: [BaseUiModule, PluralizeModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentWayComponent);
    component = fixture.componentInstance;
    component.component = mockComponents as any;
    component.paymentControl = new FormControl();
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('set paymentWays with label', () => {
    const setPaymentWaysWithType = (...types) => {
      const paymentWays = types.map((paymentType) => ({ paymentType }));
      component.component = { ...mockComponents, attrs: { paymentWays } } as any;
      component.ngOnChanges();
      fixture.detectChanges();
      return component.paymentWays;
    };

    expect(setPaymentWaysWithType(PaymentTypes.pfdod_certificate)).toEqual({
      pfdod_certificate: { label: 'Сертификатом', paymentType: 'pfdod_certificate' },
    });

    expect(setPaymentWaysWithType(PaymentTypes.private)).toEqual({
      private: { label: 'Из личных средств', paymentType: 'private' },
    });

    expect(setPaymentWaysWithType(PaymentTypes.paid)).toEqual({
      paid: { label: 'Из личных средств', paymentType: 'paid' },
    });

    expect(setPaymentWaysWithType(PaymentTypes.none)).toEqual({
      none: { label: 'Бесплатно', paymentType: 'none' },
    });

    expect(setPaymentWaysWithType(PaymentTypes.budget)).toEqual({
      budget: { label: 'Бесплатно', paymentType: 'budget' },
    });
  });
});
