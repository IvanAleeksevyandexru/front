import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { ItemsErrorResponse } from '@epgu/epgu-constructor-types';
import { DictionaryResponseError } from '../../../shared/services/dictionary/dictionary-api.types';
import { BaseInterceptor } from '../base/base.interceptor';
import { InterceptorUtilsService } from '../../services/interceptor-utils/interceptor-utils.service';
import { INTERNAL_ERROR_MODAL } from '../../services/error-handler/error-handler';
import {
  INTERNAL_ERROR_TEXT,
  INTERNAL_ERROR_TITLE,
} from '../../services/error-handler/error-handler.inteface';

@Injectable()
export class InternalErrorInterceptor extends BaseInterceptor {
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
        url.includes('dictionary/mzrf_equeue_lpu') ||
        url.includes('dictionary/mzrf_lpu_equeue_smev3') ||
        url.includes('dictionary/mzrf_regions_vaccination') ||
        url.includes('dictionary/mzrf_lpu_vaccination')) &&
      dictionaryError?.message === 'Internal Error'
    );
  }

  handle(): void {
    const config = {
      ...INTERNAL_ERROR_MODAL,
      text: INTERNAL_ERROR_MODAL.text
        .replace(/\{textAsset\}?/g, INTERNAL_ERROR_TEXT)
        .replace(/\{titleAsset\}?/g, INTERNAL_ERROR_TITLE),
    };
    this.utils.showModal(config).then((value) => this.utils.handleModalAction(value));
  }

  protected checkStatus(status: number): boolean {
    return status === 200 || status === 500;
  }
}
