import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmAddressInterface } from './interface/confirm-address.interface';
import { ScreenComponentService } from '../../../../service/screen-component/screen-component.service';

@Component({
  selector: 'app-confirm-personal-user-address-screen',
  templateUrl: './confirm-personal-user-address-screen.component.html',
  styleUrls: ['./confirm-personal-user-address-screen.component.scss'],
})
export class ConfirmPersonalUserAddressScreenComponent implements OnInit {
  @Input() data: ConfirmAddressInterface;
  @Output() actionSelect = new EventEmitter();
  isEditable: boolean;

  constructor(private screenComponentService: ScreenComponentService) {}

  ngOnInit(): void {
    this.screenComponentService.dataToSend = this.data.value;
  }

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

  dataChange($event: any) {
    console.log($event, 123);
    this.screenComponentService.dataToSend = JSON.stringify($event);
  }
}
