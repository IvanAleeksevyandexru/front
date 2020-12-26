import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../core/services/config/config.service';
import { LocationService } from '../../core/services/location/location.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import {
  ComponentActionDto,
  ComponentDto,
  ScreenActionDto,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { ScreenBase } from '../screenBase';

/**
 * Особенность этого типа компонента в том что заголовок и submit кнопка находится внутри белой плашки.
 */
@Component({
  selector: 'epgu-constructor-info-screen',
  templateUrl: './info-screen.component.html',
  styleUrls: ['./info-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class InfoScreenComponent extends ScreenBase implements OnInit {
  actionButtons: ComponentActionDto[] = [];
  screenActionButtons: ScreenActionDto[] = [];
  isSocialShareDisabled: boolean;

  constructor(
    public injector: Injector,
    public locationService: LocationService,
    private configService: ConfigService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.isSocialShareDisabled = this.configService.isSocialShareDisabled || false;
    this.screenService.component$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((component: ComponentDto): void => {
        this.setActionButtons(component);
      });
    this.screenService.buttons$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((buttons: Array<ScreenActionDto>) => {
        this.screenActionButtons = buttons || [];
      });
  }

  setActionButtons(component: ComponentDto): void {
    this.actionButtons = component?.attrs?.actions || [];
  }

  nextStep(): void {
    this.navigationService.next({});
  }
}
