import { Component, HostBinding, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from './config/config.service';
import { Config } from './config/config.types';
import { FormPlayerNavigation, Navigation, NavigationPayload, Service } from './form-player.types';
import { ScreenComponent } from './screen/screen.const';
import { FormPlayerService } from './services/form-player/form-player.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { NavigationService } from './shared/services/navigation/navigation.service';
import { ServiceDataService } from './services/service-data/service-data.service';

@Component({
  selector: 'epgu-constructor-form-player',
  templateUrl: './form-player.component.html',
  styleUrls: ['../styles/index.scss', 'form-player.component.scss'],
  providers: [UnsubscribeService],
  encapsulation: ViewEncapsulation.None,
})
export class FormPlayerComponent implements OnInit, OnChanges {
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
  ) {}

  ngOnInit(): void {
    this.checkProps();
    const orderId = this.getDraftOrderId();
    this.configService.config = this.config;
    this.formPlayerService.screenType$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.screenComponent = this.formPlayerService.getScreenComponent();
    });
    this.formPlayerService.initData(orderId);

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

  getDraftOrderId() {
    let orderId;
    if (!this.serviceDataService.invited && this.serviceDataService.orderId) {
      // TODO: add better handling for draft case;
      // eslint-disable-next-line no-restricted-globals
      const result = confirm('У вас есть предыдущее заявление, продолжить его заполнять?');
      orderId = result ? this.serviceDataService.orderId : null;
    }
    return orderId;
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
