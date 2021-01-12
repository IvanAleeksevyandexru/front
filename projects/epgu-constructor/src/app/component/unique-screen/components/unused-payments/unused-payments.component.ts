import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, filter, takeUntil, tap } from 'rxjs/operators';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { EventBusService } from '../../../../form-player/services/event-bus/event-bus.service';
import { DisplayDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ModalService } from '../../../../modal/modal.service';
import { UsePaymentsModalComponent } from '../../../../modal/use-payment-modal/use-payments-modal.component';
import { ScreenService } from '../../../../screen/screen.service';
import { UnusedPaymentInterface } from './unused-payment.interface';
import { UnusedPaymentsService } from './unused-payments.service';

@Component({
  selector: 'epgu-constructor-unused-payments',
  templateUrl: './unused-payments.component.html',
  styleUrls: ['./unused-payments.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnusedPaymentsComponent implements OnInit {
  data$: Observable<DisplayDto> = this.screenService.display$;
  orderId: string = this.screenService.getStore().orderId;
  paymentUIN: string;
  tax: UnusedPaymentInterface;

  get paymentsList$(): Observable<UnusedPaymentInterface[]> {
    return this.paymentsList.pipe(filter((v) => v.length > 0));
  }

  private paymentsList: BehaviorSubject<UnusedPaymentInterface[]> = new BehaviorSubject([]);

  constructor(
    private modalService: ModalService,
    private navigationService: NavigationService,
    public screenService: ScreenService,
    private listPaymentsService: UnusedPaymentsService,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {}

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
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(this.getListPaymentsInfoSuccess);

    this.eventBusService
      .on('radioTaxSelectedEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: UnusedPaymentInterface) => this.radioSelect(payload));
  }

  public usePayment = (uin: string): void => {
    this.paymentUIN = uin;
    this.nextStep(JSON.stringify({ reusePaymentUin: this.paymentUIN }));
  };

  public cancelUsePayment = (): void => {
    this.navigationService.prev();
  };

  next(): void {
    if (this.tax) {
      this.nextStep(JSON.stringify({ reusePaymentUin: this.tax.uin }));
    }
  }

  usePaymentsListData(data: DisplayDto): void {
    const value = JSON.parse(data.components[0].value);
    if (value.length) {
      this.paymentsList.next(value);
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
    this.changeDetectionRef.markForCheck();
  };

  getListPaymentsInfoError = ([error, data]: [HttpErrorResponse, DisplayDto]): void => {
    // eslint-disable-next-line no-console
    console.log('Error', error);
    this.usePaymentsListData(data);
    this.changeDetectionRef.markForCheck();
  };

  /**
   * Выбор радиокнопки
   * @param $event - событие выбора
   */
  radioSelect($event: UnusedPaymentInterface): void {
    this.tax = $event;
  }

  /**
   * Переход к следующему экрану
   */
  private nextStep(data: string): void {
    this.eventBusService.emit('nextStepEvent', data);
  }
}
