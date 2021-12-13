import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ConfigService } from '../../../core/services/config/config.service';

@Component({
  selector: 'epgu-cf-ui-constructor-yandex-map',
  templateUrl: './yandex-map.component.html',
  styleUrls: ['./yandex-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YandexMapComponent {
  @Input() mapControls = [];
  @Input() mapCenter: number[];
  @Input() mapIsLoaded = false;
  @Input() showMap = false;
  @Input() zoom: number;
  @Input() isListViewType: boolean;

  constructor(public config: ConfigService) {}
}
