import { Injectable } from '@angular/core';
import {
  ErrorHandlerOrderParams,
  ErrorHandlerOrderParamsAbstractService,
  TypeHelperService,
  WordTransformService
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenStore } from '../../../screen/screen.types';


@Injectable()
export class ErrorHandlerOrderParamsServiceService implements ErrorHandlerOrderParamsAbstractService {
  constructor(
    public screenService: ScreenService,
    private wordTransformService: WordTransformService,
    private typeHelperService: TypeHelperService,
  ) {}

  public getParams(): ErrorHandlerOrderParams {
    const store = this.screenService.getStore();
    let orderId = undefined;

    if (this.hasOrderId(store)) {
      orderId = this.typeHelperService.isDefined(store.orderId) ? store.orderId : store.callBackOrderId;
    }

    return {
      id: store?.display?.id,
      name: this.wordTransformService.cyrillicToLatin(store?.display?.name),
      orderId,
    };
  }

  private hasOrderId(store: ScreenStore): boolean {
    return this.typeHelperService.isDefined(store.orderId) || this.typeHelperService.isDefined(store.callBackOrderId);
  }
}
