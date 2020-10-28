import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Navigation } from '../../../form-player.types';
import { SmuEventsService } from 'epgu-lib';
import { ConfigService } from '../../../config/config.service';
import { MobilViewEvents } from '../../constants/redirect-event';


@Injectable()
export class NavigationService {

  isWebView = this.smuEventsService.smuInit;

  constructor(
    private smuEventsService: SmuEventsService,
    private configService: ConfigService
  ) {}

  clickToBack = new Subject();
  clickToBack$ = this.clickToBack.asObservable();

  // TODO для nextStep.next добавить обёртку, next(),
  //  что бы удобней было обращаться к этому методу
  nextStep = new Subject<Navigation>();
  nextStep$ = this.nextStep.asObservable();

  prevStep = new Subject<Navigation>();
  prevStep$ = this.prevStep.asObservable();

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

  private navigateInsideWebView(options) {
    this.smuEventsService.notify(options);
  }
}
