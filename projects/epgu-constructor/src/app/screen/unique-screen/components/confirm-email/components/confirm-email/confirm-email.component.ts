import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../../../config/config.service';
import {
  Navigation,
  NavigationOptions,
  NavigationPayload,
} from '../../../../../../form-player.types';
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
    private ngUnsubscribe$: UnsubscribeService,
    private navigationService: NavigationService,
    public config: ConfigService,
  ) {
    interval(5000)
      .pipe(takeUntil(ngUnsubscribe$))
      .subscribe(() => {
        this.navigationService.nextStep.next({ payload: this.getComponentState() });
      });
  }

  goBackTo() {
    const navigation: Navigation = {
      payload: this.getComponentState(),
      options: this.getOptions(),
    };
    this.navigationService.nextStep.next(navigation);
  }

  sendPostAgain() {
    const options: NavigationOptions = {
      url: 'service/actions/resendEmailConfirmation', // TODO вынести куда нибудь
    };
    this.navigationService.nextStep.next({ options });
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

  private getOptions(): NavigationOptions {
    const options: NavigationOptions = {};
    const isFinishInternalScenario =
      this.screenService.actions[0]?.action === 'goBackToMainScenario';
    if (isFinishInternalScenario) {
      options.isInternalScenarioFinish = true;
    }

    return options;
  }
}
