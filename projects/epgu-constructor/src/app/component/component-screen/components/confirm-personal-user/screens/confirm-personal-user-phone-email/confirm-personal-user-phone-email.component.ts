import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ComponentBase } from '../../../../../../screen/screen.types';
import { ComponentScreenComponentTypes } from '../../../../component-screen-components.types';
import {
  ComponentActionDto,
  DTOActionAction,
} from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { NEXT_STEP_ACTION } from '../../../../../../shared/constants/actions';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-phone-email',
  templateUrl: './confirm-personal-user-phone-email.component.html',
  styleUrls: ['./confirm-personal-user-phone-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPersonalUserPhoneEmailComponent implements OnInit {
  data$: Observable<ComponentBase> = this.screenService.component$;
  isPhoneScreenType: boolean;
  isEditContactAction: boolean;

  nextStepAction: ComponentActionDto = NEXT_STEP_ACTION;

  constructor(
    public currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    public config: ConfigService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.isEditContactAction = this.getIsEditContactAction();
      this.isPhoneScreenType = this.getIsPhoneScreenType();
      this.updateValue(data?.value);

      setTimeout(() => {
        this.changeDetectionRef.markForCheck();
      });
    });
  }

  updateValue(value: string): void {
    if (value) {
      this.currentAnswersService.isValid = true;
      this.currentAnswersService.state = value;
    } else {
      this.currentAnswersService.isValid = false;
    }
  }

  private getIsEditContactAction(): boolean {
    const isEditPhone = [DTOActionAction.editPhoneNumber, DTOActionAction.editLegalPhone].includes(
      this.screenService.action?.action,
    );
    const isEditEmail = [DTOActionAction.editEmail, DTOActionAction.editLegalEmail].includes(
      this.screenService.action?.action,
    );
    return isEditPhone || isEditEmail;
  }

  private getIsPhoneScreenType(): boolean {
    return [
      ComponentScreenComponentTypes.confirmPersonalUserPhone,
      ComponentScreenComponentTypes.confirmLegalPhone,
    ].includes(this.screenService.component?.type as ComponentScreenComponentTypes);
  }
}
