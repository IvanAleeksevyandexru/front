import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable } from '@angular/core';
import { HealthService } from '../health/health.service';
import { LoggerService } from '../logger/logger.service';
import {
  ERROR_HANDLER_ORDER_PARAMS_SERVICES,
  ErrorHandlerOrderParamsAbstractService,
} from './global-error.token';
import { ObjectHelperService } from '../object-helper/object-helper.service';

interface Error {
  message: string;
  stack: string;
}

interface ErrorParams {
  clientError: string;
  id: string;
  name: string;
  orderId: number;
  browserError: string;
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    @Inject(ERROR_HANDLER_ORDER_PARAMS_SERVICES)
    private errorHandlerOrderParamsService: ErrorHandlerOrderParamsAbstractService,
    private health: HealthService,
    private objectHelperService: ObjectHelperService,
    private loggerService: LoggerService,
  ) {}

  handleError(error: Error): void {
    if (!(error instanceof HttpErrorResponse)) {
      const orderParams = this.errorHandlerOrderParamsService.getParams();

      let errorParams = {
        clientError: error.message ? error.message : error.toString(),
        browserError: error.message ? error.stack : null,
        ...orderParams,
      };

      errorParams = this.objectHelperService.filterIncorrectObjectFields(
        errorParams,
      ) as ErrorParams;

      this.health.measureStart('clientError');
      this.health.measureEnd('clientError', 1, errorParams);

      this.loggerService.error([error]);
    }
  }
}
