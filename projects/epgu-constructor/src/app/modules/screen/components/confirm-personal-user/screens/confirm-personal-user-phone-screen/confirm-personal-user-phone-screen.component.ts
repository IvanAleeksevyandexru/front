import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentInterface } from '../../../../../../../interfaces/epgu.service.interface';
import { ComponentStateService } from '../../../../../../services/component-state/component-state.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-phone-screen',
  templateUrl: './confirm-personal-user-phone-screen.component.html',
  styleUrls: ['./confirm-personal-user-phone-screen.component.scss'],
})
export class ConfirmPersonalUserPhoneScreenComponent implements OnInit {
  @Input() data: ComponentInterface;
  @Input() errors: object;
  @Output() nextStepEvent = new EventEmitter();

  constructor(private componentStateService: ComponentStateService) {}

  ngOnInit(): void {
    // TODO возможно стоит переместить во внутриь компонента
    this.componentStateService.state = this.data.value;
  }

  clickToAction(action: NotificationAction) {
    console.log(action);
  }
}
