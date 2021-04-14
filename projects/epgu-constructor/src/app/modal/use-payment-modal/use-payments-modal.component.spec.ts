import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';

import { UsePaymentsModalComponent } from './use-payments-modal.component';
import { BaseModule } from '../../shared/base.module';
import { configureTestSuite } from 'ng-bullet';

describe('UsePaymentsModalComponent', () => {
  let component: UsePaymentsModalComponent;
  let fixture: ComponentFixture<UsePaymentsModalComponent>;

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      declarations: [UsePaymentsModalComponent],
      imports: [MockModule(BaseModule)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsePaymentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // eslint-disable-next-line no-empty-function
    component.detachView = () => {};
    // eslint-disable-next-line no-empty-function
    component.usePaymentHandler = (uin: string): void => {};
    // eslint-disable-next-line no-empty-function
    component.skipPaymentHandler = () => {};
  });

  it('should be call usePaymentHandler with uin', () => {
    const spy = jest.spyOn(component, 'usePaymentHandler');
    component.clickUsePayment('123');
    expect(spy).toHaveBeenCalledWith('123');
  });

  it('should be call skipPaymentHandler', () => {
    const spy = jest.spyOn(component, 'skipPaymentHandler');
    component.skipPaymentHandler();
    expect(spy).toHaveBeenCalledWith();
  });
});
