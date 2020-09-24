import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../../../config/config.service';
import {
  FormPlayerNavigation,
  NavigationFullOptions,
  NavigationPayload,
} from '../../../../../../form-player.types';
import { FormPlayerService } from '../../../../../../services/form-player/form-player.service';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../../../shared/services/navigation/navigation.service';
import { ScreenService } from '../../../../../screen.service';

@Component({
  selector: 'epgu-constructor-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmEmailComponent {
  // <-- variable
  timer: number;
  isTimerShow = true;

  // <-- constant
  count = 59;
  countInterval = 1000;

  constructor(
    public screenService: ScreenService,
    private formPlayerService: FormPlayerService,
    private ngUnsubscribe$: UnsubscribeService,
    private navigationService: NavigationService,
    public config: ConfigService,
  ) {
    interval(5000)
      .pipe(takeUntil(ngUnsubscribe$))
      .subscribe(() => {
        this.navigationService.nextStep.next(this.getComponentState());
      });
  }

  goBackTo() {
    this.formPlayerService.navigate(this.getComponentState(), this.getOptions());
  }

  sendPostAgain() {
    const options: NavigationFullOptions = {
      direction: FormPlayerNavigation.NEXT,
      url: 'service/actions/resendEmailConfirmation', // TODO вынести куда нибудь
    };
    this.formPlayerService.navigate({}, options);
    this.isTimerShow = true;
  }

  getComponentState(): NavigationPayload {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: String(this.screenService.componentValue),
      },
    };
  }

  timerChange(num: number) {
    if (num) {
      this.timer = num;
    } else {
      this.isTimerShow = false;
    }
  }

  private getOptions(): NavigationFullOptions {
    const options: NavigationFullOptions = { direction: FormPlayerNavigation.NEXT };
    const isFinishInternalScenario =
      this.screenService.actions[0]?.action === 'goBackToMainScenario';
    if (isFinishInternalScenario) {
      options.isInternalScenarioFinish = true;
    }

    return options;
  }
}
