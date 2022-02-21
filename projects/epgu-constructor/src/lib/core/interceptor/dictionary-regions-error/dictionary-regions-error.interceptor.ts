import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

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

  validate(response: HttpResponse<unknown> | HttpErrorResponse): boolean {
    const { url, body } = response as HttpResponse<unknown>;
    const { error } = response as HttpErrorResponse;
    const errorData = (body as ItemsErrorResponse)?.error || error?.error;
    const dictionaryError = errorData as DictionaryResponseError;

    return (
      (url.includes('dictionary/mzrf_regions_smev3') ||
        url.includes('dictionary/mzrf_regions_vaccination')) &&
      dictionaryError?.code !== 0 &&
      dictionaryError?.message !== 'Internal Error'
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
