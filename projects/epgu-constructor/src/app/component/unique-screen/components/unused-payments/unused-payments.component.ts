import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, filter, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
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
  // @Input() data: DisplayDto;
  @Output() nextStepEvent = new EventEmitter<string>();

  data$: Observable<DisplayDto> = this.screenService.display$;

  orderId: string = this.screenService.getStore().orderId;
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
    this.navigationService.prev();
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

  usePaymentsListData(data: DisplayDto): void {
    const value = JSON.parse(data.components[0].value);
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

  getListPaymentsInfoSuccess = ([data, serviceData]: [
    UnusedPaymentInterface[],
    DisplayDto,
  ]): void => {
    if (data.length) {
      this.paymentsList.next(data);
    } else {
      this.usePaymentsListData(serviceData);
    }
  };

  getListPaymentsInfoError = ([error, data]: [HttpErrorResponse, DisplayDto]): void => {
    // eslint-disable-next-line no-console
    console.log('Error', error);
    this.usePaymentsListData(data);
  };

  /**
   * Выбор радиокнопки
   * @param $event - событие выбора
   */
  radioSelect($event: UnusedPaymentInterface): void {
    this.tax = $event;
  }

  ngOnInit(): void {
    this.listPaymentsService
      .getListPaymentsInfo({ orderId: this.orderId })
      .pipe(
        catchError((err) => {
          return combineLatest([of(err), this.data$]).pipe(
            tap(this.getListPaymentsInfoError),
            concatMap(() => throwError(err)),
          );
        }),
        concatMap((data) => combineLatest([of(data), this.data$])),
      )
      .subscribe(this.getListPaymentsInfoSuccess);
  }
}
