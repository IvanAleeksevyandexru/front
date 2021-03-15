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
  clientError: string;
  id: string;
  name: string;
  orderId: number;
  stack: string;
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
        clientError: error.message ? error.message : error.toString(),
        id: store?.display?.id,
        name: this.utils.cyrillicToLatin(store?.display?.name),
        orderId: !this.isValidOrderId(store)
          ? undefined
          : this.utils.isValidOrderId(store.orderId)
            ? store.orderId
            : store.callBackOrderId,
        stack: error.message ? error.stack : null,
      };

      errorParams = this.utils.filterIncorrectObjectFields(errorParams) as ErrorParams;

      this.health.measureStart('clientError');
      this.health.measureEnd('clientError', 1, errorParams);

      this.loggerService.error([error]);
    }
  }

  private isValidOrderId(store: ScreenStore): boolean {
    return !(!this.utils.isValidOrderId(store.callBackOrderId) &&
      !this.utils.isValidOrderId(store.orderId));
  }
}
