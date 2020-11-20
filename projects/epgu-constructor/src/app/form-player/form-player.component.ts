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
import { fromEvent } from 'rxjs';
import { debounceTime, mergeMap, takeUntil } from 'rxjs/operators';
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

@Component({
  selector: 'epgu-constructor-form-player',
  templateUrl: './form-player.component.html',
  styleUrls: ['../../styles/index.scss'],
  providers: [UnsubscribeService],
  encapsulation: ViewEncapsulation.None,
})
export class FormPlayerComponent implements OnInit, OnChanges, AfterViewInit {
  @HostBinding('style.minHeight.px') minHeight: number;
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
    private screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    this.checkProps();
    this.serviceDataService.init(this.service);

    this.loadService.loaded
      .pipe(takeUntil(this.ngUnsubscribe$))
      .pipe(mergeMap(() => this.formPlayerConfigApiService.getFormPlayerConfig()))
      .subscribe((config) => {
        this.configService.config = config;
      });

    this.navService.nextStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.nextStep(data));

    this.navService.prevStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.prevStep(data));

    this.navService.skipStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.skipStep(data));

    if (this.deviceDetector.isMobile) {
      this.calculateHeight();
      this.subscribeToScroll();
    }

    this.screenService.display$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((display) => {
      this.screenId = display?.id;
    });
  }

  ngAfterViewInit() {
    this.loadService.loaded.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      const { orderId, invited, canStartNew } = this.serviceDataService;
      if (orderId) {
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

  subscribeToScroll() {
    this.zone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(takeUntil(this.ngUnsubscribe$), debounceTime(300))
        .subscribe(() => this.zone.run(() => this.calculateHeight()));
    });
  }

  calculateHeight(): void {
    const bottomIndent = 20; // отступ от нижней части экрана
    const headerHeight = document.querySelector('header').scrollHeight;
    const viewPortHeight = window.innerHeight;
    this.minHeight = viewPortHeight - headerHeight - bottomIndent;
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
      return !invited && canStartNew && !!orderId;
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
            value: true,
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

  nextStep(navigation?: Navigation) {
    this.formPlayerService.navigate(navigation, FormPlayerNavigation.NEXT);
  }

  prevStep(navigation?: Navigation) {
    this.formPlayerService.navigate(navigation, FormPlayerNavigation.PREV);
  }

  skipStep(navigation?: Navigation) {
    this.formPlayerService.navigate(navigation, FormPlayerNavigation.SKIP);
  }

  checkProps() {
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
