import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggerService, ModalService } from '@epgu/epgu-constructor-ui-kit';
import { ActionType, ComponentAttrsDto, ConfirmationModal } from '@epgu/epgu-constructor-types';

import { NavigationService } from '../../core/services/navigation/navigation.service';
import { ConfirmationModalComponent } from '../../modal/confirmation-modal/confirmation-modal.component';
import { ScreenService } from '../../screen/screen.service';

export const SUCCESS_MESSAGE = 'Приглашение отправлено';
export const FAILURE_MESSAGE = 'Ваше приглашение не было отправлено. Попробуйте позже';

@Injectable()
export class InvitationService {
  private requestOptions = { withCredentials: true };

  private successCode = 0;

  private muchTriesCode = 4;

  constructor(
    private http: HttpClient,
    private modalService: ModalService,
    private navigationService: NavigationService,
    private loggerService: LoggerService,
    private screenService: ScreenService,
  ) {}

  post<T>(path: string, body: T, attrs: ComponentAttrsDto): void {
    this.http
      .post<{ errorCode: number; errorMessage: string }>(path, body, this.requestOptions)
      .subscribe(
        (response) => {
          if (response.errorCode === this.successCode) {
            const buttons = attrs.success?.buttons || [];
            const label = attrs.success?.label || SUCCESS_MESSAGE;
            this.openModal(label, buttons);
          } else if (response.errorCode === this.muchTriesCode) {
            const buttons = attrs.muchTries?.buttons || [];
            const label = attrs.muchTries?.label || FAILURE_MESSAGE;
            this.openModal(label, buttons);
          }
        },
        (error) => {
          const buttons = attrs.error?.buttons || [];
          const label = attrs.error?.label || FAILURE_MESSAGE;
          this.openModal(label, buttons);
          this.loggerService.error(error);
        },
      );
  }

  private openModal(text: string, buttons: ConfirmationModal['buttons']): void {
    const modal: ConfirmationModal = {
      text,
      buttons,
      title: '',
      showCloseButton: false,
      showCrossButton: true,
      isShortModal: true,
    };

    this.modalService.openModal<string>(ConfirmationModalComponent, modal).subscribe((value) => {
      if (!value) {
        return;
      }

      switch (value) {
        case ActionType.redirectToLK:
          return this.navigationService.redirectToLK();
        case ActionType.nextStep:
          const invitationComponent = this.screenService.display.components[0];

          const payload = {
            [invitationComponent.id]: {
              visited: true,
              value,
            },
          };

          return this.navigationService.next({ payload });
        default:
          console.error(`Incorrect button value ${value} for LkInvitation component`);
      }
    });
  }
}
