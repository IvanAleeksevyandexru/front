import { Component, Input } from '@angular/core';

@Component({
  selector: 'epgu-constructor-address-item',
  templateUrl: './address-item.component.html',
  styleUrls: ['./address-item.component.scss'],
})
export class AddressItemComponent {
  @Input() label: string;
  @Input() tips: string;
}
