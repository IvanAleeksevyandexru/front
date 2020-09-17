import { Component, HostBinding, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FormPlayerNavigation, NavigationPayload } from './form-player.types';
import { FormPlayerService } from './services/form-player/form-player.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { NavigationService } from './shared/services/navigation/navigation.service';
import { ScreenComponent } from './screen/screen.const';
import { ConfigService } from './config/config.service';
import { Config } from './config/config.types';
import { ServiceDataService } from './services/service-data/service-data.service';

@Component({
  selector: 'epgu-constructor-form-player',
  templateUrl: './form-player.component.html',
  styleUrls: ['../styles/index.scss', 'form-player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormPlayerComponent implements OnInit, OnChanges {
  @HostBinding('class.epgu-form-player') class = true;
  @Input() serviceId: string;
  @Input() orderId: string;
  @Input() targetId: string;
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
    this.formPlayerService.initData(orderId);
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

  getDraftOrderId() {
    let orderId;
    if (this.serviceDataService.orderId) {
      // TODO: add better handling for draft case;
      // eslint-disable-next-line no-restricted-globals
      const result = confirm('У вас есть предыдущее заявление, продолжить его заполнять?');
      orderId = result ? this.serviceDataService.orderId : null;
    }
    return orderId;
  }

  ngOnChanges(): void {
    this.serviceDataService.init(this.serviceId, this.orderId, this.targetId);
    this.checkProps();
  }

  checkProps() {
    if (!this.serviceDataService.serviceId) {
      throw Error('Need to set serviceId for epgu form player');
    }

    if (!this.config) {
      throw Error('Need to set config for epgu form player');
    }
  }

  nextStep(navigationPayload?: NavigationPayload) {
    this.formPlayerService.navigate(navigationPayload, { direction: FormPlayerNavigation.NEXT });
  }

  prevStep(navigationPayload?: NavigationPayload) {
    this.formPlayerService.navigate(navigationPayload, { direction: FormPlayerNavigation.PREV });
  }
}
