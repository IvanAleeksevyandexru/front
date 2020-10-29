import {
  AfterViewInit,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { LoadService } from 'epgu-lib';
import { combineLatest } from 'rxjs';
import { ConfigService } from '../core/config/config.service';
import { FormPlayerNavigation, Navigation, NavigationPayload, Service } from './form-player.types';
import { FormPlayerService } from './services/form-player/form-player.service';
import { ModalService } from '../modal/modal.service';
import { ServiceDataService } from './services/service-data/service-data.service';
import { UnsubscribeService } from '../core/services/unsubscribe/unsubscribe.service';
import { ConfirmationModalComponent } from '../modal/components/confirmation-modal/confirmation-modal.component';
import { NavigationService } from '../core/services/navigation/navigation.service';
import { FormPlayerConfigApiService } from './services/form-player-config-api/form-player-config-api.service';

@Component({
  selector: 'epgu-constructor-form-player',
  templateUrl: './form-player.component.html',
  styleUrls: ['../../styles/index.scss', 'form-player.component.scss'],
  providers: [UnsubscribeService],
  encapsulation: ViewEncapsulation.None,
})
export class FormPlayerComponent implements OnInit, OnChanges, AfterViewInit {
  @HostBinding('class.epgu-form-player') class = true;
  @Input() service: Service;

  constructor(
    private serviceDataService: ServiceDataService,
    public formPlayerConfigApiService: FormPlayerConfigApiService,
    public formPlayerService: FormPlayerService,
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public configService: ConfigService,
    public loadService: LoadService,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.checkProps();
    this.serviceDataService.init(this.service);

    combineLatest([this.formPlayerConfigApiService.getFormPlayerConfig(), this.loadService.loaded])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((result) => {
        [this.configService.config] = result;
      });

    this.navigationService.nextStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.nextStep(data));

    this.navigationService.prevStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => this.prevStep(data));
  }

  ngAfterViewInit() {
    const { orderId, invited, canStartNew } = this.serviceDataService;
    if (orderId) {
      this.handleOrder(orderId, invited, canStartNew);
    } else {
      this.getOrderIdFromApi();
    }
  }

  ngOnChanges(): void {
    this.checkProps();
    this.serviceDataService.init(this.service);
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
    const modalResult$ = this.modalService.openModal(ConfirmationModalComponent, {
      text: `<div><img style="display:block; margin: 56px auto 24px" src="{staticDomainAssetsPath}/assets/icons/svg/order_80.svg">
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
      this.formPlayerService.initData(orderId, false);
    });
  }

  nextStep(navigation?: Navigation) {
    this.formPlayerService.navigate(navigation, FormPlayerNavigation.NEXT);
  }

  prevStep(navigation?: Navigation) {
    this.formPlayerService.navigate(navigation, FormPlayerNavigation.PREV);
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
