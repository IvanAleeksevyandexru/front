import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfigService } from '../../../core/services/config/config.service';
import { ComponentDto } from '../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-info-screen-body',
  templateUrl: './info-screen-body.component.html',
  styleUrls: ['./info-screen-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoScreenBodyComponent {
  @Input() data: ComponentDto;

  constructor(public config: ConfigService) {}
}
