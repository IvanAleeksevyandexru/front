import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ChangeDetectionStrategy } from '@angular/core';

import { RadioTaxComponent } from '../../../../../shared/components/radio-tax/radio-tax.component';
import { UnusedPaymentInterface } from '../unused-payment.interface';
import { UnusedPaymentsComponent } from './unused-payments.component';
import { configureTestSuite } from 'ng-bullet';

describe('UnusedPaymentsComponent', () => {
  let component: UnusedPaymentsComponent;
  let fixture: ComponentFixture<UnusedPaymentsComponent>;

  const paymentsDataMock: UnusedPaymentInterface[] = [
    { uin: '123', payDate: 123123, amount: 123, link: 'sdf' },
  ];
  const selectedPaymentMock: UnusedPaymentInterface = {
    uin: '123',
    payDate: 123123,
    amount: 123,
    link: 'sdf',
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [UnusedPaymentsComponent, MockComponent(RadioTaxComponent)],
    })
      .overrideComponent(UnusedPaymentsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnusedPaymentsComponent);
    component = fixture.componentInstance;
    component.payments = paymentsDataMock;
    fixture.detectChanges();
  });

  it('check', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should be set first payment of array if selectedPayment empty', () => {
      expect(component.selectedPayment).toEqual(component.payments[0]);
    });

    it('should be emit selectPaymentEvent', () => {
      jest.spyOn(component.selectPaymentEvent, 'emit');
      component.ngOnInit();
      expect(component.selectPaymentEvent.emit).toHaveBeenCalledWith(component.selectedPayment);
    });
  });

  describe('handleSelect', () => {
    it('should be set selectedPayment', () => {
      jest.spyOn(component.selectPaymentEvent, 'emit');
      component.handleSelect(selectedPaymentMock);
      expect(component.selectedPayment).toEqual(selectedPaymentMock);
      expect(component.selectPaymentEvent.emit).toHaveBeenCalledWith(component.selectedPayment);
    });
  });
});
