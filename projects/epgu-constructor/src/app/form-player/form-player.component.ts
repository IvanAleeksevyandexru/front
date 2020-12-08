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
import { NavigationService } from '../core/services/navigation/navigation.service';
import { UnsubscribeService } from '../core/services/unsubscribe/unsubscribe.service';
import { ConfirmationModalComponent } from '../modal/confirmation-modal/confirmation-modal.component';
import { ConfirmationModal } from '../modal/confirmation-modal/confirmation-modal.interface';
import { ModalService } from '../modal/modal.service';
import { ScreenService } from '../screen/screen.service';
import { FormPlayerNavigation, Navigation, NavigationPayload, Service } from './form-player.types';
import { FormPlayerConfigApiService } from './services/form-player-config-api/form-player-config-api.service';
import { FormPlayerService } from './services/form-player/form-player.service';
import { ServiceDataService } from './services/service-data/service-data.service';
import { FormPlayerApiSuccessResponse } from './services/form-player-api/form-player-api.types';
import { LoggerService } from '../core/services/logger/logger.service';

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

  constructor(
    private deviceDetector: DeviceDetectorService,
    private serviceDataService: ServiceDataService,
    public formPlayerConfigApiService: FormPlayerConfigApiService,
    public formPlayerService: FormPlayerService,
    private navService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public configService: ConfigService,
    public loadService: LoadService,
    private modalService: ModalService,
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

  ngAfterViewInit() {
    this.loadService.loaded.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((loaded) => {
      if (!loaded) return;
      const { orderId, invited, canStartNew } = this.serviceDataService;
      if (this.service.initState) {
        this.startScenarioFromProps();
      } else if (orderId) {
        this.handleOrder(orderId, invited, canStartNew);
      } else {
        this.getOrderIdFromApi();
      }
    });
  }

  ngOnChanges(): void {
    this.checkProps();
    this.serviceDataService.init(this.service);
  }

  startScenarioFromProps() {
    const store = JSON.parse(this.service.initState) as FormPlayerApiSuccessResponse;
    this.loggerService.log(['initState', store], 'Запуск плеера из предустановленого состояния');
    this.formPlayerService.store = store;
    const navigationPayload = store.scenarioDto.currentValue;
    this.formPlayerService.navigate({ payload: navigationPayload }, FormPlayerNavigation.NEXT);
  }

  getOrderIdFromApi() {
    this.formPlayerService.checkIfOrderExist().subscribe((checkOrderApiResponse) => {
      const invited = checkOrderApiResponse.isInviteScenario;
      const { canStartNew } = checkOrderApiResponse;
      const orderId = checkOrderApiResponse.scenarioDto?.orderId;
      this.serviceDataService.invited = invited;
      this.serviceDataService.orderId = orderId;
      this.serviceDataService.canStartNew = canStartNew;
      this.handleOrder(orderId, invited, canStartNew);
    });
  }

  handleOrder(orderId?: string, invited?: boolean, canStartNew?: boolean) {
    const shouldShowModal = (): boolean => {
      return (
        !invited && canStartNew && !!orderId && !this.formPlayerService.isNeedToShowLastScreen()
      );
    };

    if (shouldShowModal()) {
      this.showModal();
    } else {
      this.formPlayerService.initData(orderId, invited);
    }
  }

  showModal() {
    const modalResult$ = this.modalService.openModal<boolean, ConfirmationModal>(
      ConfirmationModalComponent,
      {
        text: `<div><img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/order_80.svg">
        <h4 style="text-align: center">У вас есть черновик заявления</h4>
        <p class="helper-text" style="text-align: center; margin-top: 8px;">Продолжить его заполнение?</p></div>`,
        showCloseButton: false,
        showCrossButton: true,
        buttons: [
          {
            label: 'Начать заново',
            color: 'white',
            closeModal: true,
          },
          {
            label: 'Продолжить',
            closeModal: true,
            value: 'ok',
          },
        ],
        isShortModal: true,
      },
    );
    modalResult$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((result) => {
      const orderId = result ? this.serviceDataService.orderId : null;
      this.formPlayerService.initData(orderId, false);
    });
  }

  private initFormPlayerConfig(): void {
    this.loadService.loaded
      .pipe(filter((loaded: boolean) => loaded))
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

  private nextStep(navigation?: Navigation): void {
    this.formPlayerService.navigate(navigation, FormPlayerNavigation.NEXT);
  }

  private prevStep(navigation?: Navigation): void {
    this.formPlayerService.navigate(navigation, FormPlayerNavigation.PREV);
  }

  private skipStep(navigation?: Navigation): void {
    this.formPlayerService.navigate(navigation, FormPlayerNavigation.SKIP);
  }

  private checkProps(): void {
    console.group('----- Init props ---------');
    console.log('service', this.service);
    console.groupEnd();
    const { invited, orderId } = this.serviceDataService;
    if (!this.serviceDataService) {
      throw Error('Need to set Service for epgu form player');
    }

    if (invited && !orderId) {
      throw Error('Should set orderId when invited');
    }
  }
}
