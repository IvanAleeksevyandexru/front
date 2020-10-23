import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DisplayDto } from '../../../../services/api/form-player-api/form-player-api.types';
import { ModalService } from '../../../../services/modal/modal.service';
import { UsePaymentsModalComponent } from '../../../../shared/components/modal/use-payment-modal/use-payment-modal/use-payments-modal.component';
import { UnusedPaymentsService } from './unused-payments.service';
import { UnusedPaymentInterface } from './unused-payment.interface';
import { NavigationService } from '../../../../shared/services/navigation/navigation.service';
import { ScreenService } from '../../../screen.service';

@Component({
  selector: 'epgu-constructor-unused-payments',
  templateUrl: './unused-payments.component.html',
  styleUrls: ['./unused-payments.component.scss'],
})
export class UnusedPaymentsComponent implements OnInit {
  // @Input() orderId: string;
  @Input() data: DisplayDto;
  @Output() nextStepEvent = new EventEmitter<any>();

  orderId: string;
  paymentsList: UnusedPaymentInterface[];
  paymentUIN: string;

  mockOrderId = '763444783';

  constructor(
    private modalService: ModalService,
    private navigationService: NavigationService,
    private screenService: ScreenService,
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
      this.showModal();
    }
  }

  showModal() {
    this.modalService.openModal(UsePaymentsModalComponent, {
      paymentsList: this.paymentsList,
      usePaymentHandler: this.usePayment,
      skipPaymentHandler: this.cancelUsePayment,
    });
  }

  getListPaymentsInfoSuccess = (data) => {
    if (data.length) {
      this.paymentsList = data;
      this.showModal();
    } else {
      // TODO: должно заменить вызов usePaymentsListData, когда будет работать rest api
      // this.navigationService.prevStep.next();
      this.usePaymentsListData();
    }
  };

  getListPaymentsInfoError = (error) => {
    // eslint-disable-next-line no-console
    console.log('Error', error);
    this.usePaymentsListData();
  };

  public ngOnInit() {
    const { orderId } = this.screenService.getStore();
    this.orderId = orderId;
    this.listPaymentsService
      .getListPaymentsInfo({ orderId: this.orderId })
      .subscribe(this.getListPaymentsInfoSuccess, this.getListPaymentsInfoError);
  }
}
