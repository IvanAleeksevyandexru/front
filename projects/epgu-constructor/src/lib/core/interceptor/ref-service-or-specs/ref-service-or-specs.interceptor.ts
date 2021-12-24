import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

import { ItemsErrorResponse } from '@epgu/epgu-constructor-types';
import { BaseInterceptor } from '../base/base.interceptor';
import { InterceptorUtilsService } from '../../services/interceptor-utils/interceptor-utils.service';
import {
  SERVICE_OR_SPEC_NO_AVAILABLE,
  SERVICE_OR_SPEC_NO_SPECIALIST,
  SERVICE_OR_SPEC_SESSION_TIMEOUT,
  STATIC_ERROR_MODAL,
} from '../../services/error-handler/error-handler';
import {
  RefName,
  SMEV2_SERVICE_OR_SPEC_NO_SPECIALIST,
  SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2,
  SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE,
  STATIC_ERROR_MESSAGE,
} from '../../services/error-handler/error-handler.inteface';
import { ScreenService } from '../../../screen/screen.service';

@Injectable()
export class RefServiceOrSpecsInterceptor extends BaseInterceptor {
  constructor(private utils: InterceptorUtilsService, private screenService: ScreenService) {
    super();
  }

  validate(response: HttpResponse<unknown>, request: HttpRequest<unknown>): boolean {
    const { url, body } = response;
    const requestBody = request?.body;
    const refName =
      // eslint-disable-next-line
      typeof requestBody === 'object' && requestBody != null ? requestBody['refName'] : undefined;

    const error = (body as ItemsErrorResponse)?.error;

    return (
      url.includes('ref/items') &&
      !!error &&
      error?.errorDetail?.errorMessage !== undefined &&
      error?.errorDetail?.errorMessage !== '' &&
      error?.errorDetail?.errorMessage.toLocaleLowerCase().trim() !==
        STATIC_ERROR_MESSAGE.toLocaleLowerCase().trim() &&
      refName === RefName.serviceOrSpecs
    );
  }

  handle(_, response: HttpResponse<unknown>): void {
    const { body } = response;
    const store = this.screenService.getStore();
    const type = store?.display?.components[0]?.type;
    const error = (body as ItemsErrorResponse)?.error;
    const errorMessage = error?.errorDetail?.errorMessage;
    const errorCode = error?.errorDetail?.errorCode;
    if (
      (errorCode === 2 && errorMessage.includes(SMEV2_SERVICE_OR_SPEC_NO_SPECIALIST)) ||
      errorMessage.includes('NO_DATA')
    ) {
      this.utils
        .showModal(SERVICE_OR_SPEC_NO_SPECIALIST)
        .then((value) => this.utils.handleModalAction(value));
    } else if (
      errorMessage.includes(SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE) &&
      type !== 'TimeSlotDoctor'
    ) {
      this.utils
        .showModal(SERVICE_OR_SPEC_NO_AVAILABLE)
        .then((value) => this.utils.handleModalAction(value));
    } else if (errorMessage.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2)) {
      this.utils
        .showModal(SERVICE_OR_SPEC_SESSION_TIMEOUT)
        .then((value) => this.utils.handleModalAction(value));
    } else if (errorMessage?.length) {
      STATIC_ERROR_MODAL.text = this.utils.getStaticErrorMessage(STATIC_ERROR_MODAL, errorMessage);
      this.utils.showModal(STATIC_ERROR_MODAL).then((value) => this.utils.handleModalAction(value));
    }
  }
}
