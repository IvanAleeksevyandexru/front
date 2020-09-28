import { Component, Input } from '@angular/core';
import { ComponentBase } from '../../../../../screen.types';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-phone-screen',
  templateUrl: './confirm-personal-user-phone-screen.component.html',
  styleUrls: ['./confirm-personal-user-phone-screen.component.scss'],
})
export class ConfirmPersonalUserPhoneScreenComponent {
  @Input() data: ComponentBase;
  @Input() errors: object;

  clickToAction(action: NotificationAction) {
    console.log(action);
  }
}
