import { InjectionToken } from '@angular/core';

export interface ErrorHandlerOrderParamsAbstractService {
  getParams: () => ErrorHandlerOrderParams
}

export interface ErrorHandlerOrderParams {
  orderId: number;
  id: string;
  name: string;
}

export const ERROR_HANDLER_ORDER_PARAMS_SERVICES = new InjectionToken<string>('errorHandlerOrderParamsService');
