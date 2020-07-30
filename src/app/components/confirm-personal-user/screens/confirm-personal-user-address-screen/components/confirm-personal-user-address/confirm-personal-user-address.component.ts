import {Component, Input, OnInit} from '@angular/core';
import {ConfirmAddressSupportedValues} from '../../../../../../interfaces/confirm-address.interface';

@Component({
  selector: 'app-confirm-personal-user-address',
  templateUrl: './confirm-personal-user-address.component.html',
  styleUrls: ['./confirm-personal-user-address.component.scss']
})
export class ConfirmPersonalUserAddressComponent implements OnInit {

  @Input() data: Array<ConfirmAddressSupportedValues>;
  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
