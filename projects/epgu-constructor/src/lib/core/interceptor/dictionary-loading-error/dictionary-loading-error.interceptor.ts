import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { ConfirmationModal, ItemsErrorResponse } from '@epgu/epgu-constructor-types';
import { SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2 } from '../../services/error-handler/error-handler.inteface';
import { DictionaryResponseError } from '../../../shared/services/dictionary/dictionary-api.types';
import { BaseInterceptor } from '../base/base.interceptor';
import { InterceptorUtilsService } from '../../services/interceptor-utils/interceptor-utils.service';
import { LOADING_ERROR_MODAL_PARAMS } from '../../services/error-handler/error-handler';

@Injectable()
export class DictionaryLoadingErrorInterceptor extends BaseInterceptor {
  constructor(private utils: InterceptorUtilsService) {
    super();
  }

  validate(response: HttpResponse<unknown> | HttpErrorResponse): boolean {
    const { url, body } = response as HttpResponse<unknown>;
    const { error } = response as HttpErrorResponse;
    const errorData = (body as ItemsErrorResponse)?.error || error?.error;
    const dictionaryError = errorData as DictionaryResponseError;

    return (
      (url.includes('dictionary/mzrf_lpu_equeue_smev3') ||
        url.includes('dictionary/mzrf_equeue_lpu') ||
        url.includes('dictionary/mzrf_lpu_vaccination')) &&
      !dictionaryError?.message?.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2) &&
      dictionaryError?.code !== 0 &&
      dictionaryError?.message !== 'Internal Error'
    );
  }

  handle(_, response: HttpResponse<unknown>): void {
    const { body } = response;
    const error = (body as ItemsErrorResponse)?.error;
    const dictionaryError = error as DictionaryResponseError;

    const modalParams = {
      ...LOADING_ERROR_MODAL_PARAMS,
      buttons: [
        {
          label: 'Начать заново',
          color: 'white',
          closeModal: true,
          value: 'init',
        },
        {
          label: 'Попробовать ещё раз',
          closeModal: true,
          value: 'prevStep',
        },
      ],
    };
    const message = dictionaryError?.message
      .replace('FAILURE:', '')
      .replace('UNKNOWN_REQUEST_DESCRIPTION:', '')
      .replace('NO_DATA:', '');
    modalParams.text = modalParams.text.replace(/\{textAsset\}?/g, message);
    this.utils
      .showModal(modalParams as ConfirmationModal)
      .then((value) => this.utils.handleModalAction(value));
  }
}
