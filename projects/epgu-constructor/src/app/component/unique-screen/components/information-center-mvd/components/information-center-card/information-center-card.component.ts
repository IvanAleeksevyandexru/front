import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MvdInfoCenterI } from '../../interface/information-center-mvd.interface';

@Component({
  selector: 'epgu-constructor-information-center-card',
  templateUrl: './information-center-card.component.html',
  styleUrls: ['./information-center-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationCenterCardComponent {
  @Input() item: MvdInfoCenterI;
}
