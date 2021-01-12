import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, throwError } from 'rxjs';
import { catchError, concatMap, filter, takeUntil, tap, map } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { EventBusService } from '../../../../form-player/services/event-bus/event-bus.service';
import { DisplayDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../../screen/screen.service';
import { UnusedPaymentInterface } from './unused-payment.interface';
import { UnusedPaymentsService } from './unused-payments.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';

@Component({
  selector: 'epgu-constructor-unused-payments-container',
  templateUrl: './unused-payments-container.component.html',
  styleUrls: ['./unused-payments-container.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnusedPaymentsContainerComponent implements OnInit {
  data$: Observable<DisplayDto> = this.screenService.display$;
  orderId: string = this.screenService.getStore().orderId;
  tax: UnusedPaymentInterface;
  showNav$: Observable<boolean> = this.screenService.showNav$;

  readonly paymentsList: BehaviorSubject<UnusedPaymentInterface[]> = new BehaviorSubject([]);

  paymentsList$: Observable<UnusedPaymentInterface[]> = this.paymentsList.pipe(
    filter((v) => v.length > 0),
  );

  cachedPaymentsList$: Observable<UnusedPaymentInterface[]> = this.data$.pipe(
    map(this.getCachedData.bind(this)),
  );

  constructor(
    public screenService: ScreenService,
    private listPaymentsService: UnusedPaymentsService,
    private eventBusService: EventBusService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
    private logger: LoggerService,
  ) {}

  ngOnInit(): void {
    this.getListPaymentsInfo().subscribe();
    this.radioTaxSelectedEvent().subscribe();
  }

  getListPaymentsInfo(): Observable<[UnusedPaymentInterface[], UnusedPaymentInterface[]]> {
    return combineLatest([
      this.listPaymentsService.getListPaymentsInfo({ orderId: this.orderId }),
      this.cachedPaymentsList$,
    ]).pipe(
      catchError(this.errorResponseHandler.bind(this)),
      takeUntil(this.ngUnsubscribe$),
      tap(this.getListPaymentsInfoSuccess.bind(this)),
    );
  }

  getCachedData(data: DisplayDto): UnusedPaymentInterface[] {
    return (data?.components[0]?.value
      ? JSON.parse(data.components[0].value)
      : []) as UnusedPaymentInterface[];
  }

  errorResponseHandler(err: HttpErrorResponse): Observable<never> {
    this.error(err);
    return this.cachedPaymentsList$.pipe(
      tap((cache) => this.paymentsList.next(cache)),
      concatMap(() => throwError(err)),
    );
  }

  radioTaxSelectedEvent(): Observable<UnusedPaymentInterface> {
    return this.eventBusService.on('radioTaxSelectedEvent').pipe(
      tap((payload: UnusedPaymentInterface) => this.radioSelect(payload)),
      takeUntil(this.ngUnsubscribe$),
    );
  }

  next(): void {
    if (this.tax) {
      this.nextStep(JSON.stringify({ reusePaymentUin: this.tax.uin }));
    }
  }

  getListPaymentsInfoSuccess([data, cache]: [
    UnusedPaymentInterface[],
    UnusedPaymentInterface[],
  ]): void {
    this.paymentsList.next(data.length ? data : cache);
  }

  error(error: HttpErrorResponse): void {
    this.logger.error([error], 'UnusedPaymentsContainerComponent');
  }

  nextStep(data: string): void {
    this.eventBusService.emit('nextStepEvent', data);
  }

  /**
   * Выбор радиокнопки
   * @param $event - событие выбора
   */
  radioSelect($event: UnusedPaymentInterface): void {
    this.tax = $event;
  }
}
