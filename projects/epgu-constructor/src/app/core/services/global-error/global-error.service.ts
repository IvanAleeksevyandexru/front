import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ScreenService } from '../../../screen/screen.service';
import { UtilsService } from '../utils/utils.service';

import { HealthService } from 'epgu-lib';

import { ScreenStore } from '../../../screen/screen.types';
import { isDefined } from '@angular/compiler/src/util';

interface Error {
  message: string;
  stack: string;
}

interface ErrorParams {
  clientError: string;
  id: string;
  name: string;
  orderId: string;
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

      console.error(error);
    }
  }

  private isValidOrderId(store: ScreenStore): boolean {
    return !this.utils.isValidOrderId(store.callBackOrderId) &&
      !this.utils.isValidOrderId(store.orderId)
      ? false
      : true;
  }
}
