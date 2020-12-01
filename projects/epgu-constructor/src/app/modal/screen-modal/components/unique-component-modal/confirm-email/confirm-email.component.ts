import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../../core/config/config.service';
import { NavigationModalService } from '../../../../../core/services/navigation-modal/navigation-modal.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { NavigationOptions, NavigationPayload } from '../../../../../form-player/form-player.types';
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

  count = 59; // 59 секунд
  countInterval = 1000; // 1 секунда

  constructor(
    public screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private navModalService: NavigationModalService,
    public config: ConfigService,
  ) {
    interval(5000)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.navModalService.next({ payload: this.getComponentState() });
      });
  }

  resendEmailConfirmation() {
    const options: NavigationOptions = {
      url: 'service/actions/resendEmailConfirmation',
    };
    this.navModalService.next({ options });
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
