import { Component, OnInit, Input } from '@angular/core';
import {
  ConfirmAddressInterface,
  ConfirmAddressActionsInterface,
} from '../../../../../screen/components/confirm-personal-user/screens/confirm-personal-user-address-screen/interface/confirm-address.interface';

@Component({
  selector: 'app-confirm-child-address',
  templateUrl: './confirm-child-address.component.html',
  styleUrls: ['./confirm-child-address.component.scss'],
})
export class ConfirmChildAddressComponent implements OnInit {
  @Input() data: ConfirmAddressInterface;
  @Input() actions: any;
  // constructor() { }

  clickToAction(event: ConfirmAddressActionsInterface) {
    const { action } = event;
    this.actions[action]();
  }

  ngOnInit(): void {
    // TODO
  }
}
