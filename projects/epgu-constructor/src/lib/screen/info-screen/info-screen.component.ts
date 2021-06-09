import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { LocationService, UnsubscribeService, ConfigService } from '@epgu/epgu-constructor-ui-kit';

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
