import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Display } from '../../../screen.types';
import { ModalService } from '../../../../services/modal/modal.service';
import { UsePaymentsModalComponent } from '../../../../shared/components/modal/use-payment-modal/use-payment-modal/use-payments-modal.component';
import { UnusedPaymentsService } from './unused-payments.service';
import { UnusedPaymentInterface } from './unused-payment.interface';
import { NavigationService } from '../../../../shared/services/navigation/navigation.service';

@Component({
  selector: 'epgu-constructor-unused-payments',
  templateUrl: './unused-payments.component.html',
  styleUrls: ['./unused-payments.component.scss'],
})
export class UnusedPaymentsComponent implements OnInit {
  @Input() orderId: string;
  @Input() data: Display;
  @Output() nextStepEvent = new EventEmitter<any>();

  paymentsList: UnusedPaymentInterface[];
  paymentUIN: string;

  mockOrderId = '9887374938';

  constructor(
    private modalService: ModalService,
    private navigationService: NavigationService,
    private listPaymentsService: UnusedPaymentsService,
  ) {}

  public usePayment = (uin: string) => {
    this.paymentUIN = uin;
    this.nextStep(JSON.stringify({ reusePaymentUin: this.paymentUIN }));
  };

  public cancelUsePayment = () => {
    this.navigationService.prevStep.next();
  };

  /**
   * Переход к следующему экрану
   */
  private nextStep(data: any): void {
    this.nextStepEvent.emit(data);
  }

  usePaymentsListData() {
    const value = JSON.parse(this.data.components[0].value);
    if (value.length) {
      this.paymentsList = value;
      this.showModal({
        paymentsList: this.paymentsList,
        usePaymentHandler: this.usePayment,
        skipPaymentHandler: this.cancelUsePayment,
      });
    }
  }

  showModal(params) {
    this.modalService.openModal(UsePaymentsModalComponent, params);
  }

  public ngOnInit() {
    this.listPaymentsService.getListPaymentsInfo({ orderId: this.orderId }).subscribe(
      (data) => {
        if (data.length) {
          this.paymentsList = data;
          this.showModal({
            paymentsList: this.paymentsList,
            usePaymentHandler: this.usePayment,
            skipPaymentHandler: this.cancelUsePayment,
          });
        } else {
          this.usePaymentsListData();
        }
      },
      (error) => {
        console.log('Error', error);
        this.usePaymentsListData();
      },
    );
  }
}
