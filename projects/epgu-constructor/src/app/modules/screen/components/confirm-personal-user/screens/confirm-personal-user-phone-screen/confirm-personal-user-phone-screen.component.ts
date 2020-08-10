import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EgpuResponseComponentInterface } from '../../../../../../../interfaces/epgu.service.interface';

@Component({
  selector: 'app-confirm-personal-user-phone-screen',
  templateUrl: './confirm-personal-user-phone-screen.component.html',
  styleUrls: ['./confirm-personal-user-phone-screen.component.scss'],
})
export class ConfirmPersonalUserPhoneScreenComponent implements OnInit {
  @Input() data: EgpuResponseComponentInterface;
  @Output() actionSelect = new EventEmitter();

  ngOnInit(): void {}

  clickToAction(action): void {
    this.actionSelect.emit(action);
  }
}
