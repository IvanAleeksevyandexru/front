import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentInterface } from '../../../../../../../interfaces/epgu.service.interface';
import { ScreenComponentService } from '../../../../service/screen-component/screen-component.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-email-screen',
  templateUrl: './confirm-personal-user-email-screen.component.html',
  styleUrls: ['./confirm-personal-user-email-screen.component.scss'],
})
export class ConfirmPersonalUserEmailScreenComponent implements OnInit {
  @Input() data: ComponentInterface;
  @Output() nextStepEvent = new EventEmitter();
  isEditable: boolean;

  constructor(private screenComponentService: ScreenComponentService) {}

  ngOnInit(): void {
    this.screenComponentService.dataToSend = this.data.value;
  }

  clickToAction(event): void {
    const { action } = event;
    switch (action) {
      case 'editUserEmail':
        this.isEditable = true;
        break;
      default:
        this.nextStepEvent.emit(this.data.value);
        break;
    }
  }
}
