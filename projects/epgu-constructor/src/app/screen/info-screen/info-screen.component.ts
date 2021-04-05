import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { ConfigService } from '../../core/services/config/config.service';
import { LocationService } from '../../core/services/location/location.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScreenBase } from '../screen-base';

@Component({
  selector: 'epgu-constructor-info-screen',
  templateUrl: './info-screen.component.html',
  styleUrls: ['./info-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoScreenComponent extends ScreenBase {
  constructor(
    public injector: Injector,
    public locationService: LocationService,
    public configService: ConfigService,
  ) {
    super(injector);
  }
}
