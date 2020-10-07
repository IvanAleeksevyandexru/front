import {
  AfterViewInit,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { LoadService } from 'epgu-lib';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from './config/config.service';
import { Config } from './config/config.types';
import { FormPlayerNavigation, Navigation, NavigationPayload, Service } from './form-player.types';
import { ScreenComponent } from './screen/screen.const';
import { FormPlayerService } from './services/form-player/form-player.service';
import { ModalService } from './services/modal/modal.service';
import { ServiceDataService } from './services/service-data/service-data.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { ConfirmationModalComponent } from './shared/components/modal/confirmation-modal/confirmation-modal.component';
import { NavigationService } from './shared/services/navigation/navigation.service';

@Component({
  selector: 'epgu-constructor-form-player',
  templateUrl: './form-player.component.html',
  styleUrls: ['../styles/index.scss', 'form-player.component.scss'],
  providers: [UnsubscribeService],
  encapsulation: ViewEncapsulation.None,
})
export class FormPlayerComponent implements OnInit, OnChanges, AfterViewInit {
  @HostBinding('class.epgu-form-player') class = true;
  @Input() service: Service;
  @Input() config: Config;
  screenComponent: ScreenComponent;

  constructor(
    private serviceDataService: ServiceDataService,
    public formPlayerService: FormPlayerService,
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    private configService: ConfigService,
    private loadService: LoadService,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.checkProps();
    this.initializeEpguLibConfig();
    this.configService.config = this.config;
    this.formPlayerService.screenType$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.screenComponent = this.formPlayerService.getScreenComponent();
    });

    this.navigationService.nextStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.nextStep(data));

    this.navigationService.prevStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.prevStep(data));
  }

  ngOnChanges(): void {
    this.serviceDataService.init(this.service);
    this.checkProps();
  }

  ngAfterViewInit(): void {
    const { orderId } = this.serviceDataService;
    if (orderId) {
      this.handleOrder(orderId);
    } else {
      this.getOrderIdFromApi();
    }
  }

  getOrderIdFromApi() {
    this.formPlayerService.getOrderId().subscribe((orderId) => {
      this.handleOrder(orderId);
    });
  }

  handleOrder(orderId: string) {
    if (!this.serviceDataService.invited && orderId) {
      this.showModal();
    } else {
      this.formPlayerService.initData(orderId);
    }
  }

  initializeEpguLibConfig(): Promise<any> {
    return this.config.production ? this.loadService.load('portal') : null;
  }

  showModal() {
    const modalResult$ = this.modalService.openModal(ConfirmationModalComponent, {
      text: `<div><img style="display:block; margin: 56px auto 24px" src="${this.config.staticDomainAssetsPath}/assets/icons/svg/order_80.svg">
        <h4 style="text-align: center">У вас есть черновик заявления</h4>
        <p class="helper-text" style="text-align: center; margin: 0">Продолжить его заполнение?</p></div>`,
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
    });
    modalResult$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((result) => {
      let orderId;
      if (result) {
        orderId = this.serviceDataService.orderId;
      } else {
        orderId = null;
      }
      this.formPlayerService.initData(orderId);
    });
  }

  nextStep(navigation?: Navigation) {
    this.formPlayerService.navigate(navigation, FormPlayerNavigation.NEXT);
  }

  prevStep(navigation?: Navigation) {
    this.formPlayerService.navigate(navigation, FormPlayerNavigation.PREV);
  }

  checkProps() {
    const { invited, orderId } = this.serviceDataService;
    if (!this.serviceDataService) {
      throw Error('Need to set Service for epgu form player');
    }

    if (invited && !orderId) {
      throw Error('Should set orderId when invited');
    }

    if (!this.config) {
      throw Error('Need to set config for epgu form player');
    }
  }
}
