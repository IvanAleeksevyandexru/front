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
  count = 59;
  countInterval = 1000;

  characterMask: string;
  codeLength: number;
  mask: string[];

  constructor(
    public screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private navigationService: NavigationService,
  ) {
    this.characterMask = this.screenService.component.attrs.characterMask;
    this.codeLength = this.screenService.component.attrs.codeLength;
    this.mask = new Array(this.codeLength).fill(new RegExp(this.characterMask));
  }

  sendCodeAgain() {
    const url = this.screenService.component.attrs.resendCodeUrl;
    const options: NavigationOptions = { url };
    this.navigationService.nextStep.next({ options });
    this.isTimerShow = true;
  }

  enterCode(code: any) {
    this.enteredCode = code;

    if (String(code).length === this.codeLength) {
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
