import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { HealthService } from 'epgu-lib';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenStore } from '../../../screen/screen.types';
import { LoggerService } from '../logger/logger.service';
import { UtilsService } from '../utils/utils.service';

interface Error {
  message: string;
  stack: string;
}

interface ErrorParams {
  ClientError: string;
  Id: string;
  Name: string;
  OrderId: number;
  BrowserError: string;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private health: HealthService,
    public screenService: ScreenService,
    private utils: UtilsService,
    private loggerService: LoggerService,
  ) {}

  handleError(error: Error): void {
    if (!(error instanceof HttpErrorResponse)) {
      const store = this.screenService.getStore();
      

      let errorParams = {
        ClientError: error.message ? error.message : error.toString(),
        Id: store?.display?.id,
        Name: this.utils.cyrillicToLatin(store?.display?.name),
        OrderId: this.hasOrderId(store) ?
          this.utils.isDefined(store.orderId) ? store.orderId : store.callBackOrderId :
          undefined,
        BrowserError: error.message ? error.stack : null,
      };

      errorParams = this.utils.filterIncorrectObjectFields(errorParams) as ErrorParams;

      this.health.measureStart('clientError');
      this.health.measureEnd('clientError', 1, errorParams);

      this.loggerService.error([error]);
    }
  }

  private hasOrderId(store: ScreenStore): boolean {
    return this.utils.isDefined(store.orderId) || this.utils.isDefined(store.callBackOrderId);
  }
}
