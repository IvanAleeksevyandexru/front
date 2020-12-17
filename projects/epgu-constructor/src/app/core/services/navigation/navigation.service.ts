import { Injectable } from '@angular/core';
import { SmuEventsService } from 'epgu-lib';
import { Observable, Subject } from 'rxjs';
import { Navigation } from '../../../form-player/form-player.types';
import {
  MobilViewEvents,
  OPTIONS_FEED_EXIT,
  OPTIONS_FEED_MV
} from '../../../shared/constants/redirect-event';
import { ConfigService } from '../../config/config.service';
import { DeviceDetectorService } from '../device-detector/device-detector.service';

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

  private nextStep = new Subject<Navigation>();
  private prevStep = new Subject<Navigation>();
  private skipStep = new Subject<Navigation>();

  constructor(
    private smuEventsService: SmuEventsService,
    private deviceDetector: DeviceDetectorService,
    private configService: ConfigService,
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
      window.location.href = `${this.configService.lkUrl}/orders/all`;
    }
  }

  redirectToHome(): void {
    if (this.isWebView) {
      this.navigateInsideWebView(MobilViewEvents.exit);
    } else {
      window.location.href = '/';
    }
  }

  redirectTo(url: string): void {
    window.location.href = url;
  }

  private navigateInsideWebView(options: typeof OPTIONS_FEED_MV | typeof OPTIONS_FEED_EXIT): void {
    this.smuEventsService.notify(options);
  }
}
