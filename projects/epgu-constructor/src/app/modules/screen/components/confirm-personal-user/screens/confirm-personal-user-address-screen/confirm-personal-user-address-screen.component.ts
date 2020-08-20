import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmAddressInterface } from './interface/confirm-address.interface';

@Component({
  selector: 'app-confirm-personal-user-address-screen',
  templateUrl: './confirm-personal-user-address-screen.component.html',
  styleUrls: ['./confirm-personal-user-address-screen.component.scss'],
})
export class ConfirmPersonalUserAddressScreenComponent {
  @Input() data: ConfirmAddressInterface;
  @Output() actionSelect = new EventEmitter();
  isEditable: boolean;

  clickToAction(event): void {
    const { action } = event;
    switch (action) {
      case 'editUserRegAddr':
        this.isEditable = true;
        break;
      default:
        this.actionSelect.emit(action);
        break;
    }
  }
}
