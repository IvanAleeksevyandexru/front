import {Component, Input, OnInit} from '@angular/core';
import {ConfirmAddressInterface} from '../../interface/confirm-address.interface';

@Component({
  selector: 'app-confirm-personal-user-address',
  templateUrl: './confirm-personal-user-address.component.html',
  styleUrls: ['./confirm-personal-user-address.component.scss']
})
export class ConfirmPersonalUserAddressComponent implements OnInit {

  @Input() data: ConfirmAddressInterface;
  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
