import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EgpuResponseComponentInterface } from '../../../../../../../interfaces/epgu.service.interface';
import { ScreenComponentService } from '../../../../service/screen-component/screen-component.service';

@Component({
  selector: 'app-confirm-personal-user-phone-screen',
  templateUrl: './confirm-personal-user-phone-screen.component.html',
  styleUrls: ['./confirm-personal-user-phone-screen.component.scss'],
})
export class ConfirmPersonalUserPhoneScreenComponent implements OnInit {
  @Input() data: EgpuResponseComponentInterface;
  @Output() nextStepEvent = new EventEmitter();
  isEditable: boolean;

  constructor(private screenComponentService: ScreenComponentService) {}

  ngOnInit(): void {
    // TODO возможно стоит переместить во внутриь компонента
    this.screenComponentService.dataToSend = this.data.value;
  }

  clickToAction(event): void {
    const { action } = event;
    switch (action) {
      case 'editUserPhone':
        this.isEditable = true;
        break;
      default:
        this.nextStepEvent.emit(this.data.value);
        break;
    }
  }
}
