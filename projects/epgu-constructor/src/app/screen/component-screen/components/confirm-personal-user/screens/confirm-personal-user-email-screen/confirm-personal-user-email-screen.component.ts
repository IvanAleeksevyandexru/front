import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentInterface } from '../../../../../../services/api/form-player-api/form-player-api.types';
import { ComponentStateService } from '../../../../../../services/component-state/component-state.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-email-screen',
  templateUrl: './confirm-personal-user-email-screen.component.html',
  styleUrls: ['./confirm-personal-user-email-screen.component.scss'],
})
export class ConfirmPersonalUserEmailScreenComponent implements OnInit {
  @Input() data: ComponentInterface;
  @Input() errors: object;
  @Output() nextStepEvent = new EventEmitter();
  isEditable: boolean;

  constructor(private componentStateService: ComponentStateService) {}

  ngOnInit(): void {
    this.componentStateService.state = this.data.value;
  }

  clickToAction(action: NotificationAction) {
    console.log(action);
  }
}
