import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DisplayDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ModalService } from '../../../../modal/modal.service';
import { UsePaymentsModalComponent } from '../../../../modal/use-payment-modal/use-payments-modal.component';
import { UnusedPaymentsService } from './unused-payments.service';
import { UnusedPaymentInterface } from './unused-payment.interface';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { ScreenService } from '../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-unused-payments',
  templateUrl: './unused-payments.component.html',
  styleUrls: ['./unused-payments.component.scss'],
})
export class UnusedPaymentsComponent implements OnInit {
  // @Input() orderId: string;
  @Input() data: DisplayDto;
  @Output() nextStepEvent = new EventEmitter<string>();

  orderId: string;
  private paymentsList: BehaviorSubject<UnusedPaymentInterface[]> = new BehaviorSubject([]);
  paymentsList$ = this.paymentsList.pipe(filter((v) => v.length > 0));
  paymentUIN: string;

  mockOrderId = '763444783';

  tax: UnusedPaymentInterface;

  constructor(
    private modalService: ModalService,
    private navigationService: NavigationService,
    private screenService: ScreenService,
    private listPaymentsService: UnusedPaymentsService,
  ) {}

  public usePayment = (uin: string): void => {
    this.paymentUIN = uin;
    this.nextStep(JSON.stringify({ reusePaymentUin: this.paymentUIN }));
  };

  public cancelUsePayment = (): void => {
    this.navigationService.prevStep.next();
  };

  /**
   * Переход к следующему экрану
   */
  private nextStep(data: string): void {
    this.nextStepEvent.emit(data);
  }

  next(): void {
    if (this.tax) {
      this.nextStep(JSON.stringify({ reusePaymentUin: this.tax.uin }));
    }
  }

  usePaymentsListData(): void {
    const value = JSON.parse(this.data.components[0].value);
    if (value.length) {
      this.paymentsList.next(value);
      // this.paymentsList = value;
      // this.showModal();
    }
  }

  showModal(): void {
    this.modalService.openModal(UsePaymentsModalComponent, {
      paymentsList: this.paymentsList.getValue(),
      usePaymentHandler: this.usePayment,
      skipPaymentHandler: this.cancelUsePayment,
    });
  }

  getListPaymentsInfoSuccess = (data): void => {
    if (data.length) {
      this.paymentsList.next(data);
      // this.paymentsList = data;
      // this.showModal();
    } else {
      // TODO: должно заменить вызов usePaymentsListData, когда будет работать rest api
      // this.navigationService.prevStep.next();
      this.usePaymentsListData();
    }
  };

  getListPaymentsInfoError = (error): void => {
    // eslint-disable-next-line no-console
    console.log('Error', error);
    this.usePaymentsListData();
  };

  /**
   * Выбор радиокнопки
   * @param $event - событие выбора
   */
  radioSelect($event: UnusedPaymentInterface): void {
    this.tax = $event;
  }

  ngOnInit(): void {
    const { orderId } = this.screenService.getStore();
    this.orderId = orderId;
    this.listPaymentsService
      .getListPaymentsInfo({ orderId: this.orderId })
      .subscribe(this.getListPaymentsInfoSuccess, this.getListPaymentsInfoError);
  }
}
