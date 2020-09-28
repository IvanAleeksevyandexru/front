import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CurrentAnswersService } from '../../../../../current-answers.service';
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

  constructor(private componentStateService: CurrentAnswersService) {}

  ngOnInit(): void {
    this.componentStateService.state = this.data.value;
  }

  clickToAction(action: NotificationAction) {
    console.log(action);
  }
}
