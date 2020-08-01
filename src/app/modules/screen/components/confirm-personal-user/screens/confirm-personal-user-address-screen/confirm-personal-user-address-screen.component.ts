import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfirmAddressInterface} from './interface/confirm-address.interface';

@Component({
  selector: 'app-confirm-personal-user-address-screen',
  templateUrl: './confirm-personal-user-address-screen.component.html',
  styleUrls: ['./confirm-personal-user-address-screen.component.scss']
})
export class ConfirmPersonalUserAddressScreenComponent implements OnInit {

  @Input() data: ConfirmAddressInterface;
  @Output() actionSelect = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  clickToAction(action): void {
    this.actionSelect.emit(action);
  }

}
