import { Component, Input, OnInit } from '@angular/core';
import { ComponentBase } from '../../../screen.types';
import { ModalService } from '../../../../services/modal/modal.service';
import { UsePaymentsModalComponent } from '../../../../shared/components/modal/use-payment-modal/use-payment-modal/use-payments-modal.component';

@Component({
  selector: 'epgu-constructor-unused-payments',
  templateUrl: './unused-payments.component.html',
  styleUrls: ['./unused-payments.component.scss'],
})
export class UnusedPaymentsComponent implements OnInit {
  @Input() data: ComponentBase;
  paymentsList: [];
  paymentUIN: string;

  mockValue = [
    {
      orderId: 1,
      sum: 530.06,
      uin: '18810187160209113620',
      linkToOrderForm: 'http://yandex.ru',
    },
    {
      orderId: 2,
      sum: 530.06,
      uin: '18810187160209113622',
      linkToOrderForm: 'http://yandex.ru',
    },
  ];

  constructor(private modalService: ModalService) {}

  public usePayment = (uin: string) => {
    this.paymentUIN = uin;
  };

  showModal(params) {
    this.modalService.openModal(UsePaymentsModalComponent, params);
  }

  public ngOnInit() {
    this.paymentsList = this.data?.value ? JSON.parse(this.data.value) : this.mockValue;
    if (this.paymentsList.length) {
      this.showModal({ paymentsList: this.paymentsList, usePaymentHandler: this.usePayment });
    }
  }
}
