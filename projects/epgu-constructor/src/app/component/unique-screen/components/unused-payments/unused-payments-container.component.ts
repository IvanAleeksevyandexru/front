import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, throwError } from 'rxjs';
import { catchError, concatMap, filter, map, tap } from 'rxjs/operators';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { DisplayDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../../screen/screen.service';
import { UnusedPaymentInterface } from './unused-payment.interface';
import { UnusedPaymentsService } from './unused-payments.service';

@Component({
  selector: 'epgu-constructor-unused-payments-container',
  templateUrl: './unused-payments-container.component.html',
  styleUrls: ['./unused-payments-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnusedPaymentsContainerComponent {
  data$: Observable<DisplayDto> = this.screenService.display$;

  orderId: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.screenService.getStore().orderId,
  );

  tax: BehaviorSubject<UnusedPaymentInterface> = new BehaviorSubject<UnusedPaymentInterface>(null);
  showNav$: Observable<boolean> = this.screenService.showNav$;

  readonly paymentsList: BehaviorSubject<UnusedPaymentInterface[]> = new BehaviorSubject([]);

  paymentsList$: Observable<UnusedPaymentInterface[]> = this.paymentsList.pipe(
    filter((v) => v.length > 0),
  );

  cachedPaymentsList$: Observable<UnusedPaymentInterface[]> = this.data$.pipe(
    map(this.getCachedData.bind(this)),
  );

  getListPaymentsInfo$: Observable<
    [UnusedPaymentInterface[], UnusedPaymentInterface[]]
  > = this.orderId.pipe(concatMap(this.getListPaymentsInfoByOrderId.bind(this)));

  radioTaxSelectedEvent$: Observable<UnusedPaymentInterface> = this.eventBusService
    .on('radioTaxSelectedEvent')
    .pipe(tap((payload: UnusedPaymentInterface) => this.radioSelect(payload)));

  constructor(
    public screenService: ScreenService,
    private listPaymentsService: UnusedPaymentsService,
    private eventBusService: EventBusService,
    private logger: LoggerService,
  ) {}

  getListPaymentsInfoByOrderId(
    orderId: string,
  ): Observable<[UnusedPaymentInterface[], UnusedPaymentInterface[]]> {
    return combineLatest([
      this.listPaymentsService.getListPaymentsInfo({ orderId }),
      this.cachedPaymentsList$,
    ]).pipe(
      catchError(this.errorResponseHandler.bind(this)),
      tap(([data, cache]) => this.paymentsList.next(data.length ? data : cache)),
    );
  }

  getCachedData(data: DisplayDto): UnusedPaymentInterface[] {
    return (data?.components[0]?.value
      ? JSON.parse(data.components[0].value)
      : []) as UnusedPaymentInterface[];
  }

  errorResponseHandler(error: HttpErrorResponse): Observable<never> {
    this.logger.error([error], 'UnusedPaymentsContainerComponent');
    return this.cachedPaymentsList$.pipe(
      tap((cache) => this.paymentsList.next(cache)),
      concatMap(() => throwError(error)),
    );
  }

  next(): void {
    const tax = this.tax.getValue();
    if (tax) {
      this.eventBusService.emit('nextStepEvent', JSON.stringify({ reusePaymentUin: tax.uin }));
    }
  }

  /**
   * Выбор радиокнопки
   * @param $event - событие выбора
   */
  radioSelect($event: UnusedPaymentInterface): void {
    this.tax.next($event);
  }
}
