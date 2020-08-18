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
  @Output() actionSelect = new EventEmitter();

  constructor(private screenComponentService: ScreenComponentService) {}

  ngOnInit(): void {
    this.screenComponentService.dataToSend = this.data.value;
  }

  clickToAction(action): void {
    this.actionSelect.emit(action);
  }
}
