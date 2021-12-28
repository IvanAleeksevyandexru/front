import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { ItemsErrorResponse } from '@epgu/epgu-constructor-types';
import { DictionaryResponseError } from '../../../shared/services/dictionary/dictionary-api.types';
import { BaseInterceptor } from '../base/base.interceptor';
import { InterceptorUtilsService } from '../../services/interceptor-utils/interceptor-utils.service';
import { STATIC_ERROR_MODAL } from '../../services/error-handler/error-handler';
import {
  INTERNAL_ERROR_TEXT,
  INTERNAL_ERROR_TITLE,
} from '../../services/error-handler/error-handler.inteface';

@Injectable()
export class InternalErrorInterceptor extends BaseInterceptor {
  constructor(private utils: InterceptorUtilsService) {
    super();
  }

  validate(response: HttpResponse<unknown>): boolean {
    const { url, body } = response;
    const error = (body as ItemsErrorResponse)?.error;
    const dictionaryError = error as DictionaryResponseError;
    return (
      (url.includes('dictionary/mzrf_regions_smev3') ||
        url.includes('dictionary/mzrf_equeue_lpu') ||
        url.includes('dictionary/mzrf_lpu_equeue_smev3') ||
        url.includes('dictionary/mzrf_regions_vaccination') ||
        url.includes('dictionary/mzrf_lpu_vaccination')) &&
      dictionaryError?.message === 'Internal Error'
    );
  }

  handle(): void {
    const config = {
      ...STATIC_ERROR_MODAL,
      title: INTERNAL_ERROR_TITLE,
      text: STATIC_ERROR_MODAL.text.replace(/\{textAsset\}?/g, INTERNAL_ERROR_TEXT),
    };
    this.utils.showModal(config);
  }
}
