import { Component, HostBinding, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FormPlayerNavigation, NavigationPayload, Service } from './form-player.types';
import { FormPlayerService } from './services/form-player/form-player.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { NavigationService } from './shared/services/navigation/navigation.service';
import { ScreenComponent } from './screen/screen.const';
import { ConfigService } from './config/config.service';
import { Config } from './config/config.types';

@Component({
  selector: 'epgu-constructor-form-player',
  templateUrl: './form-player.component.html',
  styleUrls: ['../styles/index.scss', 'form-player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormPlayerComponent implements OnInit, OnChanges {
  @HostBinding('class.epgu-form-player') class = true;
  @Input() service: Service;
  @Input() config: Config;
  screenComponent: ScreenComponent;

  constructor(
    public formPlayerService: FormPlayerService,
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    private configService: ConfigService,
  ) {}

  ngOnInit(): void {
    this.checkProps();
    const orderId = this.getDraftOrderId();
    this.configService.config = this.config;
    this.formPlayerService.initData(this.service, orderId);

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
    if (this.service.orderId) {
      // TODO: add better handling for draft case;
      // eslint-disable-next-line no-restricted-globals
      const result = confirm('У вас есть предыдущее заявление, продолжить его заполнять?');
      orderId = result ? this.service.orderId : null;
    }
    return orderId;
  }

  ngOnChanges(): void {
    this.checkProps();
  }

  checkProps() {
    if (!this.service) {
      throw Error('Need to set Service for epgu form player');
    }

    if (!this.config) {
      throw Error('Need to set config for epgu form player');
    }
  }

  nextStep(navigationPayload?: NavigationPayload) {
    this.formPlayerService.navigate(
      this.service.serviceId,
      FormPlayerNavigation.NEXT,
      navigationPayload,
    );
  }

  prevStep(navigationPayload?: NavigationPayload) {
    this.formPlayerService.navigate(
      this.service.serviceId,
      FormPlayerNavigation.PREV,
      navigationPayload,
    );
  }
}
