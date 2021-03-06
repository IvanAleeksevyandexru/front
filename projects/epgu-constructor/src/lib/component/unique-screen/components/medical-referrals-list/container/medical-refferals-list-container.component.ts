import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import {
  ComponentActionDto,
  ComponentDto,
  ConfirmationModal,
  DisclaimerDto,
  ScreenButton,
} from '@epgu/epgu-constructor-types';
import { ModalService } from '@epgu/epgu-constructor-ui-kit';

import { ScreenService } from '../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import {
  Referral,
  ReferralsInfo,
  ReferralsListParsedValue,
  ReferralsListResponse,
} from '../medical-referrals-list.types';
import { ActionService } from '../../../../../shared/directives/action/action.service';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../../core/services/error-handler/error-handler';
import { ConfirmationModalComponent } from '../../../../../modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'epgu-constructor-medical-referrals-list-container',
  templateUrl: './medical-referrals-list-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalReferralsListContainerComponent {
  readonly nextAction = NEXT_STEP_ACTION;
  screenButton: ComponentActionDto;

  medicalReferralsInfo$: Observable<{
    referrals: Referral[];
    disclaimer: DisclaimerDto;
  }> = combineLatest([this.screenService.component$, this.screenService.button$]).pipe(
    filter(([component]) => !!component.value),
    map(([component, button]) => this.mapIntoReferralsInfo(component, button)),
    tap((referralsInfo: ReferralsInfo) => {
      this.screenButton = referralsInfo.button;
      this.currentAnswersService.isValid = true;
    }),
    map((referralsInfo: ReferralsInfo) => ({
      referrals: this.mapMedicalInfo(JSON.parse(referralsInfo.value.medicalInfo)?.medicalData),
      disclaimer: referralsInfo.disclaimer,
    })),
  );

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private actionService: ActionService,
    private modalService: ModalService,
  ) {}

  sendReferral(referral: Referral): void {
    this.currentAnswersService.state = referral.originalItem;
    this.actionService.switchAction(this.nextAction, this.screenService.component.id);
  }

  getModalParams(errorMessage: string): ConfirmationModal {
    return {
      ...COMMON_ERROR_MODAL_PARAMS(),
      text: `<div class="text_modal_error">
        <img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
        <h4>???? ?????????????? ?????????????????? ???????????? ??????????????????????</h4>
        <span>
        ${
          errorMessage ||
          `???????????????????? ?????????? ?????? ?????????????? ??????????. ???????? ???????????? ???? ?????????????????? ??? ???????????????? ??
        <a target="_blank" href="https://www.gosuslugi.ru/feedback">???????????? ??????????????????</a>.`
        }
        </span>
        </div>`,
      buttons: [
        {
          label: '??????????????',
          closeModal: true,
          color: 'white',
        },
        {
          label: '?????????????????????? ?????? ??????',
          closeModal: true,
          value: 'reload',
        },
      ],
    };
  }

  private mapIntoReferralsInfo(component: ComponentDto, button: ScreenButton): ReferralsInfo {
    const parsedValue: ReferralsListParsedValue = JSON.parse(component.value);
    return {
      disclaimer: {
        ...component.attrs.disclaimer,
        description: component.arguments.referralDisclaimerDescription,
      },
      button: {
        ...button,
        label: parsedValue.buttonLabel || button.label,
      },
      value: parsedValue,
    };
  }

  private showError(errorMessage: string): void {
    this.modalService
      .openModal(ConfirmationModalComponent, {
        ...this.getModalParams(errorMessage),
      })
      .subscribe((reload) => {
        if (reload) {
          this.currentAnswersService.state = 'retry';
          this.actionService.switchAction(this.nextAction, this.screenService.component.id);
        }
      });
  }

  private mapMedicalInfo(medicalReferralsResponse: ReferralsListResponse): Referral[] {
    if (
      medicalReferralsResponse.error === null ||
      medicalReferralsResponse.error?.errorDetail.errorCode === 0
    ) {
      return medicalReferralsResponse.items.map((item) => ({
        ...item.convertedAttributes,
        originalItem: item,
      }));
    }

    this.showError(medicalReferralsResponse.error?.errorDetail?.errorMessage);
    return null;
  }
}
