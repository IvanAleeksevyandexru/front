import { Injectable } from '@angular/core';
import { SmuEventsService } from 'epgu-lib';
import { Observable, Subject } from 'rxjs';
import { Navigation } from '../../../form-player/form-player.types';
import {
  MobilViewEvents,
  OPTIONS_FEED_EXIT,
  OPTIONS_FEED_MV
} from '../../../shared/constants/redirect-event';
import { ConfigService } from '../config/config.service';
import { DeviceDetectorService } from '../device-detector/device-detector.service';
import { LocationService } from '../location/location.service';
import { ScenarioDto } from '../../../form-player/services/form-player-api/form-player-api.types';

/**
 * Этот сервис должен быть запровайден только на уровне компанент, не стоит его провайдить через модули.
 */
@Injectable()
export class NavigationService {
  isWebView: boolean;
  get nextStep$(): Observable<Navigation> {
    return this.nextStep.asObservable();
  }
  get prevStep$(): Observable<Navigation> {
    return this.prevStep.asObservable();
  }
  get skipStep$(): Observable<Navigation> {
    return this.skipStep.asObservable();
  }
  get patchStepOnCli$(): Observable<Partial<ScenarioDto>> {
    return this.patchStepOnCli.asObservable();
  }

  private nextStep = new Subject<Navigation>();
  private prevStep = new Subject<Navigation>();
  private skipStep = new Subject<Navigation>();
  private patchStepOnCli = new Subject<Partial<ScenarioDto>>();

  constructor(
    private smuEventsService: SmuEventsService,
    private deviceDetector: DeviceDetectorService,
    private configService: ConfigService,
    private locationService: LocationService,
  ) {
    this.isWebView = this.deviceDetector.isWebView;
  }

  next(navigation?: Navigation): void {
    this.nextStep.next(navigation);
  }

  prev(navigation?: Navigation): void {
    this.prevStep.next(navigation);
  }

  skip(navigation?: Navigation): void {
    this.skipStep.next(navigation);
  }

  patchOnCli(newScenarioDtoDiff?: Partial<ScenarioDto>): void {
    this.patchStepOnCli.next(newScenarioDtoDiff);
  }

  redirectToProfileEdit(): void {
    if (this.isWebView) {
      this.locationService.href('/profile/user');
    } else {
      this.locationService.href(`${this.configService.lkUrl}/profile/personal`);
    }
  }

  redirectToLK(): void {
    if (this.isWebView) {
      this.navigateInsideWebView(MobilViewEvents.exit);
    } else {
      this.locationService.href(`${this.configService.lkUrl}/notifications`);
    }
  }

  redirectToHome(): void {
    if (this.isWebView) {
      this.navigateInsideWebView(MobilViewEvents.exit);
    } else {
      this.locationService.href('/');
    }
  }

  redirectTo(url: string): void {
    this.locationService.href(url);
  }

  private navigateInsideWebView(options: typeof OPTIONS_FEED_MV | typeof OPTIONS_FEED_EXIT): void {
    this.smuEventsService.notify(options);
  }
}
