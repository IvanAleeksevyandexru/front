import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'epgu-constructor-address-item',
  templateUrl: './address-item.component.html',
  styleUrls: ['./address-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressItemComponent {
  @Input() label: string;
  @Input() hint: string;
  @Input() tips: string;
}
