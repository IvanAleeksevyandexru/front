import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfirmPhoneInterface} from '../../../../interfaces/confirm-phone.interface';

@Component({
  selector: 'app-confirm-personal-user-phone-screen',
  templateUrl: './confirm-personal-user-phone-screen.component.html',
  styleUrls: ['./confirm-personal-user-phone-screen.component.scss']
})
export class ConfirmPersonalUserPhoneScreenComponent implements OnInit {

  @Input() data: ConfirmPhoneInterface;
  @Output() actionSelect = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  clickToAction(action): void {
    this.actionSelect.emit(action);
  }
}
