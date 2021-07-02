import { Injectable } from '@angular/core';
import {
  ErrorHandlerOrderParams,
  ErrorHandlerOrderParamsAbstractService,
  UtilsService
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenStore } from '../../../screen/screen.types';


@Injectable()
export class ErrorHandlerOrderParamsServiceService implements ErrorHandlerOrderParamsAbstractService {
  constructor(
    public screenService: ScreenService,
    private utils: UtilsService,
  ) {}

  public getParams(): ErrorHandlerOrderParams {
    const store = this.screenService.getStore();
    let orderId = undefined;

    if (this.hasOrderId(store)) {
      orderId = this.utils.isDefined(store.orderId) ? store.orderId : store.callBackOrderId;
    }

    return {
      id: store?.display?.id,
      name: this.utils.cyrillicToLatin(store?.display?.name),
      orderId,
    };
  }

  private hasOrderId(store: ScreenStore): boolean {
    return this.utils.isDefined(store.orderId) || this.utils.isDefined(store.callBackOrderId);
  }
}
