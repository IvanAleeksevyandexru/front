import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { ItemsErrorResponse } from '@epgu/epgu-constructor-types';
import { DictionaryResponseError } from '../../../shared/services/dictionary/dictionary-api.types';
import { SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2 } from '../../services/error-handler/error-handler.inteface';
import { BaseInterceptor } from '../base/base.interceptor';
import { InterceptorUtilsService } from '../../services/interceptor-utils/interceptor-utils.service';
import { SERVICE_OR_SPEC_SESSION_TIMEOUT } from '../../services/error-handler/error-handler';

@Injectable()
export class DictionaryLoadingTimeoutInterceptor extends BaseInterceptor {
  constructor(private utils: InterceptorUtilsService) {
    super();
  }

  validate(response: HttpResponse<unknown>): boolean {
    const { url, body } = response;
    const error = (body as ItemsErrorResponse)?.error;
    const dictionaryError = error as DictionaryResponseError;

    return (
      (url.includes('dictionary/mzrf_lpu_equeue_smev3') ||
        url.includes('dictionary/mzrf_equeue_lpu') ||
        url.includes('dictionary/mzrf_lpu_vaccination')) &&
      dictionaryError?.message.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2)
    );
  }

  handle(): void {
    this.utils
      .showModal(SERVICE_OR_SPEC_SESSION_TIMEOUT)
      .then((value) => this.utils.handleModalAction(value));
  }
}
