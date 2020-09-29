import { Component } from '@angular/core';
import { ScreenService } from '../../../../../screen.service';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../../../shared/services/navigation/navigation.service';
import { NavigationOptions, NavigationPayload } from '../../../../../../form-player.types';

@Component({
  selector: 'epgu-constructor-confirm-phone',
  templateUrl: './confirm-phone.component.html',
  styleUrls: ['./confirm-phone.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmPhoneComponent {
  // <-- variable
  enteredCode: number;
  timer: number;
  isTimerShow = true;

  // <-- constant
  correctCodeLength = 8;
  mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  count = 59;
  countInterval = 1000;

  constructor(
    public screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private navigationService: NavigationService,
  ) {}

  sendCodeAgain() {
    const options: NavigationOptions = {
      url: 'service/actions/resendPhoneConfirmationCode', // TODO вынести куда нибудь
    };
    this.navigationService.nextStep.next({ options });
    this.isTimerShow = true;
  }

  enterCode(code: any) {
    this.enteredCode = code;
    if (String(code).length === this.correctCodeLength) {
      this.navigationService.nextStep.next({ payload: this.getComponentState() });
    }
  }

  getComponentState(): NavigationPayload {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: String(this.enteredCode),
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
