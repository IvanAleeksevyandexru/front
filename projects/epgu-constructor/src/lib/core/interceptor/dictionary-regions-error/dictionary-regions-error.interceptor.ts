import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { ItemsErrorResponse } from '@epgu/epgu-constructor-types';
import { DictionaryResponseError } from '../../../shared/services/dictionary/dictionary-api.types';
import { BaseInterceptor } from '../base/base.interceptor';
import { InterceptorUtilsService } from '../../services/interceptor-utils/interceptor-utils.service';
import { REGIONS_MODAL } from '../../services/error-handler/error-handler';

@Injectable()
export class DictionaryRegionsErrorInterceptor extends BaseInterceptor {
  constructor(private utils: InterceptorUtilsService) {
    super();
  }

  validate(response: HttpResponse<unknown>): boolean {
    const { url, body } = response;
    const error = (body as ItemsErrorResponse)?.error;
    const dictionaryError = error as DictionaryResponseError;

    return (
      (url.includes('dictionary/mzrf_regions_smev3') ||
        url.includes('dictionary/mzrf_regions_vaccination')) &&
      dictionaryError?.code !== 0
    );
  }

  handle(_, response: HttpResponse<unknown>): void {
    const { body } = response;
    const error = (body as ItemsErrorResponse)?.error;
    const dictionaryError = error as DictionaryResponseError;

    const message = dictionaryError?.message
      .replace('FAILURE:', '')
      .replace('UNKNOWN_REQUEST_DESCRIPTION:', '');
    REGIONS_MODAL.text = REGIONS_MODAL.text.replace(/\{textAsset\}?/g, message);
    this.utils.showModal(REGIONS_MODAL);
  }
}
