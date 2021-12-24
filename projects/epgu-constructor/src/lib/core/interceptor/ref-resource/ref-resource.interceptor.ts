import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { ConfirmationModal, ItemsErrorResponse } from '@epgu/epgu-constructor-types';
import { BaseInterceptor } from '../base/base.interceptor';
import { InterceptorUtilsService } from '../../services/interceptor-utils/interceptor-utils.service';
import {
  LOADING_ERROR_MODAL_PARAMS,
  NO_DOCTORS,
  RESOURCE_NOT_AVAILABLE,
  SERVICE_OR_SPEC_SESSION_TIMEOUT_2,
} from '../../services/error-handler/error-handler';
import {
  NO_AVAILABLE_DATA,
  RefName,
  SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2,
  SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE,
  STATIC_ERROR_MESSAGE,
} from '../../services/error-handler/error-handler.inteface';
import { ScreenService } from '../../../screen/screen.service';

@Injectable()
export class RefResourceInterceptor extends BaseInterceptor {
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
      refName === RefName.resource
    );
  }

  handle(_, response: HttpResponse<unknown>): void {
    const { body } = response;
    const store = this.screenService.getStore();
    const type = store?.display?.components[0]?.type;
    const error = (body as ItemsErrorResponse)?.error;
    const errorMessage = error?.errorDetail?.errorMessage;

    if (
      errorMessage.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2) &&
      !errorMessage.includes(SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE)
    ) {
      SERVICE_OR_SPEC_SESSION_TIMEOUT_2.buttons = [
        {
          label: 'Начать заново',
          closeModal: true,
          value: 'init',
        },
      ];
      this.utils
        .showModal(SERVICE_OR_SPEC_SESSION_TIMEOUT_2)
        .then((value) => this.utils.handleModalAction(value));
    } else if (
      errorMessage.includes(SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE) &&
      !errorMessage.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2) &&
      type !== 'TimeSlotDoctor'
    ) {
      const modalParams = {
        ...RESOURCE_NOT_AVAILABLE,
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
      } as ConfirmationModal;
      this.utils.showModal(modalParams).then((value) => this.utils.handleModalAction(value));
    } else if (errorMessage.includes(NO_AVAILABLE_DATA)) {
      this.utils.showModal(NO_DOCTORS).then((value) => this.utils.handleModalAction(value));
    } else if (type !== 'TimeSlotDoctor') {
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
      const message = errorMessage
        .replace('FAILURE:', '')
        .replace('UNKNOWN_REQUEST_DESCRIPTION:', '')
        .replace('NO_DATA:', '');
      modalParams.text = modalParams.text.replace(/\{textAsset\}?/g, message);
      this.utils
        .showModal(modalParams as ConfirmationModal)
        .then((value) => this.utils.handleModalAction(value));
    }
  }
}
