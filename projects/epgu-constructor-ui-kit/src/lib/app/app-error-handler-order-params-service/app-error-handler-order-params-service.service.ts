import { Injectable } from '@angular/core';
import {
  ErrorHandlerOrderParams,
  ErrorHandlerOrderParamsAbstractService
} from '../../core/services/global-error/global-error.token';
import { AppStateQuery } from '../app-state/app-state.query';
import { UtilsService } from '../../core/services/utils/utils.service';


@Injectable()
export class AppErrorHandlerOrderParamsServiceService implements ErrorHandlerOrderParamsAbstractService {
  constructor(
    private appStateQuery: AppStateQuery<unknown, unknown>,
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
