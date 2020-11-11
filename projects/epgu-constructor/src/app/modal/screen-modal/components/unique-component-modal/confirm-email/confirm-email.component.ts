import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { interval } from 'rxjs';
import { ConfigService } from '../../../../../core/config/config.service';
import { NavigationOptions, NavigationPayload } from '../../../../../form-player/form-player.types';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../../core/services/navigation/navigation.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { NavigationModalService } from '../../../../../core/services/navigation-modal/navigation-modal.service';

@Component({
  selector: 'epgu-constructor-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmEmailComponent {
  timer: number;
  isTimerShow = true;

  // <-- constant
  count = 59;
  countInterval = 1000;

  constructor(
    public screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private navService: NavigationService,
    private navModalService: NavigationModalService,
    public config: ConfigService,
  ) {
    interval(5000)
      .pipe(takeUntil(ngUnsubscribe$))
      .subscribe(() => {
        this.navModalService.next({ payload: this.getComponentState() });
      });
  }

  sendPostAgain() {
    const options: NavigationOptions = {
      url: 'service/actions/resendEmailConfirmation', // TODO вынести куда нибудь
    };
    this.navService.nextStep.next({ options });
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
}
