import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { Observable, Subject } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { ScenarioDto, OrgType, ComponentActionDto } from '@epgu/epgu-constructor-types';
import { Navigation } from '../../../form-player/form-player.types';
import {
  MobilViewEvents,
  OPTIONS_FEED_EXIT,
  OPTIONS_FEED_MV,
  OPTIONS_PROFILE_MV,
} from '@epgu/epgu-constructor-ui-kit';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { LocationService, WINDOW } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../screen/screen.service';

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
  get saveCacheToDraft$(): Observable<Navigation> {
    return this.saveCacheToDraft.asObservable();
  }
  get restartOrder$(): Observable<Navigation> {
    return this.restart.asObservable();
  }
  get patchStepOnCli$(): Observable<Partial<ScenarioDto>> {
    return this.patchStepOnCli.asObservable();
  }

  private nextStep = new Subject<Navigation>();
  private prevStep = new Subject<Navigation>();
  private skipStep = new Subject<Navigation>();
  private saveCacheToDraft = new Subject<Navigation>();
  private restart = new Subject<Navigation>();
  private patchStepOnCli = new Subject<Partial<ScenarioDto>>();

  constructor(
    private smuEventsService: SmuEventsService,
    private deviceDetector: DeviceDetectorService,
    private configService: ConfigService,
    private locationService: LocationService,
    private screenService: ScreenService,
    @Inject(WINDOW) private window: Window,
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

  saveCache(navigation?: Navigation): void {
    this.saveCacheToDraft.next(navigation);
  }

  restartOrder(navigation?: Navigation): void {
    this.restart.next(navigation);
  }

  patchOnCli(newScenarioDtoDiff?: Partial<ScenarioDto>): void {
    this.patchStepOnCli.next(newScenarioDtoDiff);
  }

  redirectToProfileEdit(): void {
    this.locationService.href(`${this.configService.lkUrl}/settings/edit`);
  }

  redirectToLK(isLegal?: boolean, action?: ComponentActionDto): void {
    const queryParams = action?.queryParams;
    const preparedQueryParams = queryParams ? `?${new URLSearchParams(queryParams as Record<string, string>).toString()}` : '';

    if (this.isWebView || isLegal) {
      this.locationService.href(`${this.configService.lkUrl}/notifications`);
    } else {
      this.locationService.href(`${this.configService.lkUrl}/orders/all${preparedQueryParams}`);
    }
  }

  redirectToLKByOrgType(action): void {
    const { additionalParameters } = this.screenService.getStore();
    const isLegal = [OrgType.Legal, OrgType.Business].includes(additionalParameters?.orgType);
    this.redirectToLK(isLegal, action);
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

  redirectToLKAccount(): void {
    if (this.isWebView) {
      this.locationService.href(`${this.configService.lkUrl}/profile/user`);
    } else {
      this.locationService.href(`${this.configService.lkUrl}/settings/account`);
    }
  }

  redirectExternal(url: string): void {
    this.window.open(url, '_blank');
  }

  private navigateInsideWebView(
    options: typeof OPTIONS_FEED_MV | typeof OPTIONS_FEED_EXIT | typeof OPTIONS_PROFILE_MV,
  ): void {
    this.smuEventsService.notify(options);
  }
}
