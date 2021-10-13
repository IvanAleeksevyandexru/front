import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import {
  LocationService,
  UnsubscribeService,
  ConfigService,
  DeviceDetectorService,
} from '@epgu/epgu-constructor-ui-kit';

import { ScreenBase } from '../screen-base';

@Component({
  selector: 'epgu-constructor-info-screen',
  templateUrl: './info-screen.component.html',
  styleUrls: ['./info-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoScreenComponent extends ScreenBase {
  isWebView: boolean;

  constructor(
    public injector: Injector,
    public locationService: LocationService,
    public configService: ConfigService,
    private deviceDetector: DeviceDetectorService,
  ) {
    super(injector);
    this.isWebView = this.deviceDetector.isWebView;
  }
}
