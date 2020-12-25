import {
  AfterViewInit,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { LoadService } from 'epgu-lib';
import { filter, mergeMap, takeUntil, tap, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../core/config/config.service';
import { NavigationService } from '../core/services/navigation/navigation.service';
import { UnsubscribeService } from '../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../screen/screen.service';
import { FormPlayerNavigation, Navigation, NavigationPayload, Service } from './form-player.types';
import { FormPlayerConfigApiService } from './services/form-player-config-api/form-player-config-api.service';
import { FormPlayerService } from './services/form-player/form-player.service';
import { ServiceDataService } from './services/service-data/service-data.service';
import { FormPlayerStartService } from './services/form-player-start/form-player-start.service';

@Component({
  selector: 'epgu-constructor-form-player',
  templateUrl: './form-player.component.html',
  styleUrls: ['../../styles/index.scss'],
  providers: [UnsubscribeService, FormPlayerStartService],
  encapsulation: ViewEncapsulation.None,
})
export class FormPlayerComponent implements OnInit, OnChanges, AfterViewInit {
  @HostBinding('class.epgu-form-player') class = true;
  @HostBinding('attr.test-screen-id') screenId: string;
  @Input() service: Service;

  public isFirstLoading$ = this.screenService.isLoading$.pipe(take(3));
  private isCoreConfigLoaded$ = this.loadService.loaded.pipe(filter((loaded: boolean) => loaded));
  private isConfigReady$ = new BehaviorSubject<boolean>(false);

  constructor(
    private serviceDataService: ServiceDataService,
    public formPlayerConfigApiService: FormPlayerConfigApiService,
    public formPlayerService: FormPlayerService,
    private navService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public configService: ConfigService,
    public loadService: LoadService,
    public screenService: ScreenService,
    public formPlayerStartService: FormPlayerStartService,
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

  ngOnChanges(changes: SimpleChanges): void {
    this.serviceDataService.init(this.service);

    if (
      changes.service.previousValue &&
      changes.service.previousValue.serviceId !== changes.service.currentValue.serviceId
    ) {
      this.restartPlayer();
    }
  }

  private initFormPlayerConfig(): void {
    this.isCoreConfigLoaded$
      .pipe(
        tap(() => {
          this.configService.configId = this.service.configId;
          this.configService.initCore();
        }),
        mergeMap(() => this.formPlayerConfigApiService.getFormPlayerConfig()),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((config) => {
        this.configService.config = config;
        this.isConfigReady$.next(true);
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
    this.isConfigReady$
      .pipe(
        filter((loaded: boolean) => loaded),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(() => {
        this.formPlayerStartService.startPlayer();
      });
  }

  private restartPlayer(): void {
    this.formPlayerStartService.restartPlayer();
    this.isFirstLoading$ = this.screenService.isLoading$.pipe(take(3));
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
