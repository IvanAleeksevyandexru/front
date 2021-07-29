import { Injectable } from '@angular/core';
import {
  ErrorHandlerOrderParams,
  ErrorHandlerOrderParamsAbstractService
} from '../../core/services/global-error/global-error.token';
import { MicroAppStateQuery } from '../micro-app-state/micro-app-state-query.service';
import { UtilsService } from '../../core/services/utils/utils.service';


@Injectable()
export class MicroAppErrorHandlerOrderParamsServiceService implements ErrorHandlerOrderParamsAbstractService {
  constructor(
    private appStateQuery: MicroAppStateQuery<unknown, unknown>,
    private utils: UtilsService,
  ) {}

  public getParams(): ErrorHandlerOrderParams {
    const { id, name, orderId } = this.appStateQuery.fpHealthPayload;

    return  {
      id,
      orderId,
      name: this.utils.cyrillicToLatin(name)
    };
  }
}
