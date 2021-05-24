import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { ComponentActionDto, ComponentDto, ConfirmationModal } from 'epgu-constructor-types';
import { ScreenService } from '../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { Referral } from '../medical-referrals-list.types';
import { ActionService } from '../../../../../shared/directives/action/action.service';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';
import { ConfirmationModalComponent } from '../../../../../modal/confirmation-modal/confirmation-modal.component';
import { ModalService } from '../../../../../modal/modal.service';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../../core/interceptor/errors/errors.interceptor.constants';

@Component({
  selector: 'epgu-constructor-medical-referrals-list-container',
  templateUrl: './medical-referrals-list-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalReferralsListContainerComponent {
  readonly nextAction = NEXT_STEP_ACTION;
  action: ComponentActionDto;

  medicalReferrals$: Observable<Referral[]> = this.screenService.component$.pipe(
    filter((component: ComponentDto) => !!component.value),
    tap((component: ComponentDto) => {
      this.action = component.attrs.answers[0] as ComponentActionDto;
      this.currentAnswersService.isValid = true;
    }),
    map((component: ComponentDto) => this.mapComponentValue(component)),
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

  private getModalParams(errorMessage: string): ConfirmationModal {
    return {
      ...COMMON_ERROR_MODAL_PARAMS,
      text: `<div class="text_modal_error">
        <img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
        <h4>Не удалось загрузить список направлений</h4>
        <span>
        ${
          errorMessage ||
          `Попробуйте снова или зайдите позже. Если ничего не изменится — напишите в
        <a target="_blank" href="https://www.gosuslugi.ru/feedback">службу поддержки</a>.`
        }
        </span>
        </div>`,
      buttons: [
        {
          label: 'Закрыть',
          closeModal: true,
          color: 'white',
        },
        {
          label: 'Попробовать ещё раз',
          closeModal: true,
          value: 'reload',
        },
      ],
    };
  }

  private mapComponentValue(component: ComponentDto): Referral[] {
    const medicalReferralsResponse = JSON.parse(component.value);

    if (
      medicalReferralsResponse.error === null ||
      medicalReferralsResponse.error?.errorDetail.errorCode === 0
    ) {
      return medicalReferralsResponse.items.map((item) => {
        const attributes = item.attributes.reduce((cur, prev) => {
          return { [prev.name]: prev.value, ...cur };
        }, {}) as Referral;

        return { ...attributes, originalItem: item };
      });
    }

    this.showError(medicalReferralsResponse.error?.errorDetail?.errorMessage);
    return null;
  }
}
