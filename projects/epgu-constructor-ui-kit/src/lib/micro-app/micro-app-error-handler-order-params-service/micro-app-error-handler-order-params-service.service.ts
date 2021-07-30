import { Injectable } from '@angular/core';
import {
  ErrorHandlerOrderParams,
  ErrorHandlerOrderParamsAbstractService
} from '../../core/services/global-error/global-error.token';
import { MicroAppStateQuery } from '../micro-app-state/micro-app-state.query';
import { WordTransformService } from '../../core/services/word-transform/word-transform.service';


@Injectable({ providedIn: 'root' })
export class MicroAppErrorHandlerOrderParamsServiceService implements ErrorHandlerOrderParamsAbstractService {
  constructor(
    private appStateQuery: MicroAppStateQuery<unknown, unknown>,
    private wordTransformService: WordTransformService,
  ) {}

  public getParams(): ErrorHandlerOrderParams {
    const { id, name, orderId } = this.appStateQuery.fpHealthPayload;

    return  {
      id,
      orderId,
      name: this.wordTransformService.cyrillicToLatin(name)
    };
  }
}
