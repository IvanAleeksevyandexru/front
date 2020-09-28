import { Component, Input, OnInit } from '@angular/core';
import { ComponentStateService } from '../../../../../../components/component-state.service';
import { ComponentBase } from '../../../../../screen.types';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-phone-screen',
  templateUrl: './confirm-personal-user-phone-screen.component.html',
  styleUrls: ['./confirm-personal-user-phone-screen.component.scss'],
})
export class ConfirmPersonalUserPhoneScreenComponent implements OnInit {
  @Input() data: ComponentBase;
  @Input() errors: object;

  constructor(private componentStateService: ComponentStateService) {}

  ngOnInit(): void {
    // TODO возможно стоит переместить во внутриь компонента
    this.componentStateService.state = this.data.value;
  }

  clickToAction(action: NotificationAction) {
    console.log(action);
  }
}
