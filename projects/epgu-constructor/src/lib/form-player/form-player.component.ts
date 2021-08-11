import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { LoadService } from '@epgu/epgu-lib';
import { filter, mergeMap, takeUntil, tap, take, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { ScenarioDto } from '@epgu/epgu-constructor-types';
import {
  UnsubscribeService,
  ConfigService,
  ConfigApiService,
  TracingService,
} from '@epgu/epgu-constructor-ui-kit';

import { NavigationService } from '../core/services/navigation/navigation.service';
import { ScreenService } from '../screen/screen.service';
import {
  FormPlayerContext,
  FormPlayerNavigation,
  Navigation,
  NavigationPayload,
  ServiceEntity,
} from './form-player.types';
import { FormPlayerService } from './services/form-player/form-player.service';
import { InitDataService } from '../core/services/init-data/init-data.service';
import { FormPlayerStartManager } from './services/form-player-start/form-player-start.manager';
import { AutocompleteService } from '../core/services/autocomplete/autocomplete.service';

/**
 * Точка входа для приложения, эквивалент AppComponent.
 *   При запуске подтягивает данные из конфигов, и тригерит старт приложения.
 */
@Component({
  selector: 'epgu-constructor-form-player',
  templateUrl: './form-player.component.html',
  styleUrls: ['../../styles/index.scss'],
  providers: [UnsubscribeService, FormPlayerStartManager],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class FormPlayerComponent implements OnInit, OnChanges, AfterViewInit {
  @HostBinding('class.epgu-constructor') class = true;
  @HostBinding('attr.test-screen-id') screenId: string;
  @Input() service: ServiceEntity;
  @Input() context: FormPlayerContext = {};

  public isFirstLoading$ = this.screenService.isLoading$.pipe(take(3));
  private isCoreConfigLoaded$ = this.loadService.loaded.pipe(filter((loaded: boolean) => loaded));
  private isConfigReady$ = new BehaviorSubject<boolean>(false);

  constructor(
    private initDataService: InitDataService,
    public formPlayerConfigApiService: ConfigApiService,
    public formPlayerService: FormPlayerService,
    private navService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public configService: ConfigService,
    public loadService: LoadService,
    public screenService: ScreenService,
    public formPlayerStartService: FormPlayerStartManager,
    private changeDetectionRef: ChangeDetectorRef,
    private autocompleteService: AutocompleteService,
    private tracingService: TracingService,
  ) {}

  ngOnInit(): void {
    this.initDataService.init(this.service, this.context);
    this.initFormPlayerConfig();
    this.initNavigation();
    this.initSettingOfScreenIdToAttr();
    this.initLoader();
  }

  ngAfterViewInit(): void {
    this.startPlayer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initDataService.init(this.service, this.context);

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
          this.configService.configId = this.context?.configId;
          this.configService.initCore();
        }),
        mergeMap(() => this.formPlayerConfigApiService.getFormPlayerConfig()),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((config) => {
        this.configService.config = config;
        this.isConfigReady$.next(true);

        this.changeDetectionRef.markForCheck();
      });
  }

  private initConfigDependentEntities(): void {
    this.autocompleteService.init(this.configService.isAutocompleteServiceDisabled || false);
    this.tracingService.init(this.configService.zipkinGenerationEnabled || false);
    this.screenService.serviceCode$
      .pipe(
        filter((serviceCode) => serviceCode !== null),
        distinctUntilChanged(
          (prevServiceCode, nextServiceCode) => prevServiceCode === nextServiceCode,
        ),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((serviceCode: string) => {
        this.tracingService.serviceCode = serviceCode;
      });
  }

  private initNavigation(): void {
    this.navService.nextStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => {
        this.nextStep(data);
        this.changeDetectionRef.markForCheck();
      });

    this.navService.prevStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => {
        this.prevStep(data);
        this.changeDetectionRef.markForCheck();
      });

    this.navService.skipStep$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: NavigationPayload) => {
        this.skipStep(data);
        this.changeDetectionRef.markForCheck();
      });

    this.navService.patchStepOnCli$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: Partial<ScenarioDto>) => {
        this.patchStepOnCli(data);
        this.changeDetectionRef.markForCheck();
      });
  }

  private initSettingOfScreenIdToAttr(): void {
    this.screenService.display$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((display) => {
      this.screenId = display?.id;
      this.changeDetectionRef.markForCheck();
    });
  }

  private startPlayer(): void {
    this.isConfigReady$
      .pipe(
        filter((loaded: boolean) => loaded),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(() => {
        this.initConfigDependentEntities();
        this.formPlayerStartService.startPlayer();
        this.changeDetectionRef.markForCheck();
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

  private patchStepOnCli(newScenarioDtoDiff?: Partial<ScenarioDto>): void {
    this.formPlayerService.patchStore(newScenarioDtoDiff);
  }

  private initLoader(): void {
    this.screenService.isLoaderVisible.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      setTimeout(() => this.changeDetectionRef.detectChanges(), 0);
    });
  }
}
