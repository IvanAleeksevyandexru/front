import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentStateService } from '../../../../../../services/component-state/component-state.service';
import { ComponentBase } from '../../../../../screen.types';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-email-screen',
  templateUrl: './confirm-personal-user-email-screen.component.html',
  styleUrls: ['./confirm-personal-user-email-screen.component.scss'],
})
export class ConfirmPersonalUserEmailScreenComponent implements OnInit {
  @Input() data: ComponentBase;
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
