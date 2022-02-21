import { Injectable } from '@angular/core';
import { ConfirmationModal, ErrorModal } from '@epgu/epgu-constructor-types';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { STATUS_ICON_MAP } from '../error-handler/error-handler';
import { LocationService, ModalService } from '@epgu/epgu-constructor-ui-kit';
import { NavigationService } from '../navigation/navigation.service';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';

@Injectable()
export class InterceptorUtilsService {
  constructor(
    private modalService: ModalService,
    private locationService: LocationService,
    private navigationService: NavigationService,
    private formPlayer: FormPlayerService,
  ) {}

  public getConfirmationModalParamsFromErrorModalParams(
    params: ErrorModal,
    isConfirm: boolean,
  ): ConfirmationModal {
    const confirmationModalParams = { ...params };
    const statusIcon = params.content.statusIcon ? STATUS_ICON_MAP[params.content.statusIcon] : '';
    const header = params.content.header ? `<h4>${params.content.header}</h4>` : '';
    let helperText: string;
    helperText = params.content.helperText ? `<span>${params.content.helperText}</span>` : '';
    confirmationModalParams.text = `<div class="text_modal_error ${
      isConfirm ? 'confirm_code' : ''
    }">${statusIcon}${header}${helperText}</div>`;
    return confirmationModalParams;
  }

  public handleModalAction(actionValue: unknown): void {
    switch (actionValue) {
      case 'init':
        this.formPlayer.initData();
        break;

      case 'prevStep':
        this.navigationService.prev();
        break;

      case 'redirectToLk':
        this.navigationService.redirectToLK();
        break;

      case 'reload':
        this.locationService.reload();
        break;
    }
  }

  public showModal(params: ConfirmationModal, traceId?: string): Promise<unknown> {
    return this.modalService
      .openModal(ConfirmationModalComponent, { ...params, traceId })
      .toPromise();
  }

  public showErrorModal(params: ErrorModal, isConfirm: boolean): Promise<unknown> {
    const confirmationModalParams = this.getConfirmationModalParamsFromErrorModalParams(
      params,
      isConfirm,
    );
    return this.modalService
      .openModal(ConfirmationModalComponent, confirmationModalParams)
      .toPromise();
  }

  public getStaticErrorMessage(modalReference: ConfirmationModal, errorMessage: string): string {
    const message = errorMessage
      .replace('FAILURE:', '')
      .replace('UNKNOWN_REQUEST_DESCRIPTION:', '')
      .replace('NO_DATA:', '');

    return modalReference.text.replace(/\{textAsset\}?/g, message);
  }
}
