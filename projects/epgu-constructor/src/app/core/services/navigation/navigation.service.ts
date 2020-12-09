import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Navigation } from '../../../form-player/form-player.types';
import { SmuEventsService } from 'epgu-lib';
import { ConfigService } from '../../config/config.service';
import { MobilViewEvents, OPTIONS_FEED_MV, OPTIONS_FEED_EXIT } from '../../../shared/constants/redirect-event';
import { DeviceDetectorService } from '../device-detector/device-detector.service';

/**
 * Этот сервис должен быть запровайден только на уровне компанент, не стоит его провайдить через модули.
 */
@Injectable()
export class NavigationService {
  isWebView: boolean;

  private nextStep = new Subject<Navigation>();
  nextStep$ = this.nextStep.asObservable();

  private prevStep = new Subject<Navigation>();
  prevStep$ = this.prevStep.asObservable();

  private skipStep = new Subject<Navigation>();
  skipStep$ = this.skipStep.asObservable();

  constructor(
    private smuEventsService: SmuEventsService,
    private deviceDetector: DeviceDetectorService,
    private configService: ConfigService
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

  redirectToProfileEdit(): void {
    if (this.isWebView) {
      window.location.href = '/profile/user';
    } else {
      window.location.href = `${this.configService.lkUrl}/profile/personal`;
    }
  }

  redirectToLK(): void {
    if (this.isWebView) {
      this.navigateInsideWebView(MobilViewEvents.feed);
    } else {
      window.location.href = `${this.configService.lkUrl}/orders/all `;
    }
  }

  redirectToHome(): void {
    if (this.isWebView) {
      this.navigateInsideWebView(MobilViewEvents.exit);
    } else {
      window.location.href = '/';
    }
  }

  private navigateInsideWebView(options: typeof OPTIONS_FEED_MV | typeof OPTIONS_FEED_EXIT) {
    this.smuEventsService.notify(options);
  }
}
