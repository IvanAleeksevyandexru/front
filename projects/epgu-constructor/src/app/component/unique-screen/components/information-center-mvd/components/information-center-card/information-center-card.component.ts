import { Component, Input } from '@angular/core';
import { MvdInfoCanterInterface } from '../../interface/information-center-mvd.interface';

@Component({
  selector: 'epgu-constructor-information-center-card',
  templateUrl: './information-center-card.component.html',
  styleUrls: ['./information-center-card.component.scss'],
})
export class InformationCenterCardComponent {
  @Input() item: MvdInfoCanterInterface;
}
