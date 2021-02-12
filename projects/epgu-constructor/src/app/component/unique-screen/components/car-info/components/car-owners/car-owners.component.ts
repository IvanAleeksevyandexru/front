import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OwnerPeriod } from '../../models/car-info.interface';

@Component({
  selector: 'epgu-constructor-car-owners',
  templateUrl: './car-owners.component.html',
  styleUrls: ['./car-owners.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarOwnersComponent {
  @Input() ownerPeriods: OwnerPeriod[];
}
