import { Component, Input } from '@angular/core';
import { ConfigService } from '../../../../config/config.service';

@Component({
  selector: 'epgu-constructor-info-screen-body',
  templateUrl: './info-screen-body.component.html',
  styleUrls: ['./info-screen-body.component.scss'],
})
export class InfoScreenBodyComponent {
  @Input() data: any;

  constructor(public config: ConfigService) {}
}
