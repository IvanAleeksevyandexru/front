import { Component } from '@angular/core';
import { ScreenService } from '../../../../../screen.service';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../../../shared/services/navigation/navigation.service';
import {
  FormPlayerNavigation,
  NavigationFullOptions,
  NavigationPayload,
} from '../../../../../../form-player.types';
import { FormPlayerService } from '../../../../../../services/form-player/form-player.service';

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
    private formPlayerService: FormPlayerService,
  ) {}

  sendCodeAgain() {
    const options: NavigationFullOptions = {
      direction: FormPlayerNavigation.NEXT,
      url: 'service/actions/resendPhoneConfirmationCode', // TODO вынести куда нибудь
    };
    this.formPlayerService.navigate({}, options);
    this.isTimerShow = true;
  }

  enterCode(code: any) {
    this.enteredCode = code;
    if (String(code).length === this.correctCodeLength) {
      this.navigationService.nextStep.next(this.getComponentState());
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
