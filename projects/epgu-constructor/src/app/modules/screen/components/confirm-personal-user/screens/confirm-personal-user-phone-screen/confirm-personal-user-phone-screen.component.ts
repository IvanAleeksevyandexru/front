import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentInterface } from '../../../../../../../interfaces/epgu.service.interface';
import { ScreenComponentService } from '../../../../service/screen-component/screen-component.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-phone-screen',
  templateUrl: './confirm-personal-user-phone-screen.component.html',
  styleUrls: ['./confirm-personal-user-phone-screen.component.scss'],
})
export class ConfirmPersonalUserPhoneScreenComponent implements OnInit {
  @Input() data: ComponentInterface;
  @Input() errors: object;
  @Output() nextStepEvent = new EventEmitter();

  constructor(private screenComponentService: ScreenComponentService) {}

  ngOnInit(): void {
    // TODO возможно стоит переместить во внутриь компонента
    this.screenComponentService.dataToSend = this.data.value;
  }
}
