import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Display } from '../../../screen.types';
import { ModalService } from '../../../../services/modal/modal.service';
import { UsePaymentsModalComponent } from '../../../../shared/components/modal/use-payment-modal/use-payment-modal/use-payments-modal.component';
import { UnusedPaymentsService } from './unused-payments.service';
import { UnusedPaymentInterface } from './unused-payment.interface';

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

  mockOrderId = '763438139';

  constructor(
    private modalService: ModalService,
    private listPaymentsService: UnusedPaymentsService,
  ) {}

  public usePayment = (uin: string) => {
    this.paymentUIN = uin;
    this.nextStep({ value: this.paymentUIN });
  };

  public skipPayment = () => {
    this.nextStep({ value: null });
  };

  /**
   * Переход к следующему экрану
   */
  private nextStep(data: any): void {
    this.nextStepEvent.emit(data);
  }

  showModal(params) {
    this.modalService.openModal(UsePaymentsModalComponent, params);
  }

  public ngOnInit() {
    this.listPaymentsService.getListPaymentsInfo({ orderId: this.mockOrderId }).subscribe(
      (data) => {
        if (data.length) {
          this.paymentsList = data;
          this.showModal({
            paymentsList: this.paymentsList,
            usePaymentHandler: this.usePayment,
            skipPaymentHandler: this.skipPayment,
          });
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }
}
