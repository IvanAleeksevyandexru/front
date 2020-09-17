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
  // <-- constant
  timerSecond = 59;
  correctCodeLength = 4;
  mask = [/\d/, /\d/, /\d/, /\d/];
  code: number;
  timer: number;

  constructor(
    public screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private navigationService: NavigationService,
    private formPlayerService: FormPlayerService,
  ) {}

  sendCodeAgain() {
    const options: NavigationFullOptions = {
      direction: FormPlayerNavigation.NEXT,
      url: 'service/actions/resendPhoneConfirmationCode',
    };
    this.formPlayerService.navigate({}, options);
  }

  enterCode(code: any) {
    this.code = code;
    if (String(code).length === this.correctCodeLength) {
      this.navigationService.nextStep.next(this.getComponentState());
    }
  }

  getComponentState(): NavigationPayload {
    return {
      [this.screenService.component.id]: {
        visited: true,
        value: String(this.code),
      },
    };
  }
}
