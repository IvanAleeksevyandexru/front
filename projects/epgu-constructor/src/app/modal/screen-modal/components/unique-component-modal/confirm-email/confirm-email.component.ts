import { Component } from '@angular/core';
import { ConfigService } from '../../../../../core/config/config.service';
import { NavigationOptions } from '../../../../../form-player/form-player.types';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../../core/services/navigation/navigation.service';
import { ScreenService } from '../../../../../screen/screen.service';

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
    private navigationService: NavigationService,
    public config: ConfigService,
  ) {}

  sendPostAgain() {
    const options: NavigationOptions = {
      url: 'service/actions/resendEmailConfirmation', // TODO вынести куда нибудь
    };
    this.navigationService.nextStep.next({ options });
    this.isTimerShow = true;
  }

  timerChange(num: number) {
    if (num) {
      this.timer = num;
    } else {
      this.isTimerShow = false;
    }
  }
}
