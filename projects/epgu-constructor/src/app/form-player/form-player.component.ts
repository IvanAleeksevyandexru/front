import {
  AfterViewInit,
  Component,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { LoadService } from 'epgu-lib';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { ConfigService } from '../core/config/config.service';
import { DeviceDetectorService } from '../core/services/device-detector/device-detector.service';
import { LoggerService } from '../core/services/logger/logger.service';
import { NavigationService } from '../core/services/navigation/navigation.service';
import { UnsubscribeService } from '../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../screen/screen.service';
import { FormPlayerNavigation, Navigation, NavigationPayload, Service } from './form-player.types';
import {
  CheckOrderApiResponse,
  FormPlayerApiSuccessResponse,
} from './services/form-player-api/form-player-api.types';
import { FormPlayerConfigApiService } from './services/form-player-config-api/form-player-config-api.service';
import { FormPlayerService } from './services/form-player/form-player.service';
import { ServiceDataService } from './services/service-data/service-data.service';
import { ContinueOrderModalService } from '../modal/continue-order-modal/continue-order-modal.service';

@Component({
  selector: 'epgu-constructor-form-player',
  templateUrl: './form-player.component.html',
  styleUrls: ['../../styles/index.scss'],
  providers: [UnsubscribeService],
  encapsulation: ViewEncapsulation.None,
})
export class FormPlayerComponent implements OnInit, OnChanges, AfterViewInit {
  @HostBinding('class.epgu-form-player') class = true;
  @HostBinding('attr.test-screen-id') screenId: string;
  @Input() service: Service;

  isCoreConfigLoaded$ = this.loadService.loaded.pipe(filter((loaded: boolean) => loaded));

  constructor(
    private deviceDetector: DeviceDetectorService,
    private serviceDataService: ServiceDataService,
    public formPlayerConfigApiService: FormPlayerConfigApiService,
    public formPlayerService: FormPlayerService,
    private navService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public configService: ConfigService,
    public loadService: LoadService,
    public continueOrderModalService: ContinueOrderModalService,
    private zone: NgZone,
    public screenService: ScreenService,
    private loggerService: LoggerService,
  ) {}

  ngOnInit(): void {
    this.serviceDataService.init(this.service);
    this.initFormPlayerConfig();
    this.initNavigation();
    this.initSettingOfScreenIdToAttr();
  }

  ngAfterViewInit(): void {
    this.startPlayer();
  }

  ngOnChanges(): void {
    this.serviceDataService.init(this.service);
  }

  private initFormPlayerConfig(): void {
    this.isCoreConfigLoaded$
      .pipe(mergeMap(() => this.formPlayerConfigApiService.getFormPlayerConfig()))
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((config) => {
        this.configService.config = config;
      });
  }

  private initNavigation(): void {
    this.navService.nextStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.nextStep(data));

    this.navService.prevStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.prevStep(data));

    this.navService.skipStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.skipStep(data));
  }

  private initSettingOfScreenIdToAttr(): void {
    this.screenService.display$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((display) => {
      this.screenId = display?.id;
    });
  }

  private startPlayer(): void {
    this.isCoreConfigLoaded$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      const { orderId, invited, canStartNew, initState } = this.service;
      if (initState) {
        this.startScenarioFromProps();
      } else if (this.hasOrderStatus(orderId, invited, canStartNew)) {
        this.handleOrder(orderId, invited, canStartNew);
      } else if (orderId) {
        this.getOrderStatus();
      } else {
        this.getOrderIdFromApi();
      }
    });
  }

  private hasOrderStatus(orderId?: string, invited?: boolean, canStartNew?: boolean): boolean {
    return orderId && (typeof invited === 'boolean' || typeof canStartNew === 'boolean');
  }

  private startScenarioFromProps(): void {
    const store = JSON.parse(this.service.initState) as FormPlayerApiSuccessResponse;
    this.loggerService.log(['initState', store], 'Запуск плеера из предустановленого состояния');
    this.formPlayerService.store = store;
    const payload = store.scenarioDto.currentValue;
    this.formPlayerService.navigate({ payload }, FormPlayerNavigation.NEXT);
  }

  private getOrderStatus(): void {
    this.formPlayerService
      .getOrderStatus(this.service.orderId)
      .subscribe((checkOrderApiResponse) => {
        this.handleOrderDataResponse(checkOrderApiResponse);
      });
  }

  private getOrderIdFromApi(): void {
    this.formPlayerService.checkIfOrderExist().subscribe((checkOrderApiResponse) => {
      this.handleOrderDataResponse(checkOrderApiResponse);
    });
  }

  private handleOrderDataResponse(checkOrderApiResponse: CheckOrderApiResponse): void {
    const { isInviteScenario: invited, canStartNew, orderId } = checkOrderApiResponse;
    this.serviceDataService.invited = invited;
    this.serviceDataService.orderId = orderId;
    this.serviceDataService.canStartNew = canStartNew;
    this.handleOrder(orderId, invited, canStartNew);
  }

  private handleOrder(orderId?: string, invited?: boolean, canStartNew?: boolean): void {
    if (this.shouldShowContinueOrderModal(orderId, invited, canStartNew)) {
      this.showContinueOrderModal();
    } else {
      this.formPlayerService.initData(orderId, invited);
    }
  }

  private shouldShowContinueOrderModal(
    orderId?: string,
    invited?: boolean,
    canStartNew?: boolean,
  ): boolean {
    return !invited && canStartNew && !!orderId && !this.formPlayerService.isNeedToShowLastScreen();
  }

  private showContinueOrderModal(): void {
    this.continueOrderModalService
      .openModal()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((result) => {
        const orderId = result ? this.serviceDataService.orderId : null;
        this.formPlayerService.initData(orderId, false);
      });
  }

  private nextStep(navigation?: Navigation): void {
    this.formPlayerService.navigate(navigation, FormPlayerNavigation.NEXT);
  }

  private prevStep(navigation?: Navigation): void {
    this.formPlayerService.navigate(navigation, FormPlayerNavigation.PREV);
  }

  private skipStep(navigation?: Navigation): void {
    this.formPlayerService.navigate(navigation, FormPlayerNavigation.SKIP);
  }
}
