import { ChangeDetectorRef, Component, Injector } from '@angular/core';
import {
  AppState,
  DataDirectionType,
  InputAppDto,
  OutputAppDto,
} from '@epgu/epgu-constructor-types';
import { BehaviorSubject } from 'rxjs';
import { filter, mergeMap, take, takeUntil, tap } from 'rxjs/operators';
import { LoadService } from '@epgu/epgu-lib';

import { AppStateService } from '../app-state/app-state.service';
import { CfAppStateService } from '../../core/services/cf-app-state/cf-app-state.service';
import { AppStateQuery } from '../app-state/app-state.query';
import { LocationService } from '../../core/services/location/location.service';
import { LocalStorageService } from '../../core/services/local-storage/local-storage.service';
import { AppNavigationRuleService } from '../app-navigation-rule/app-navigation-rule.service';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { ConfigService } from '../../core/services/config/config.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ConfigApiService } from '../../core/services/config-api/config-api.service';

export const getAppStorageKey = (
  componentType: string,
  componentId: string,
  orderId: string | number,
): string => {
  return `APP_STORAGE_${componentType.toUpperCase()}_${componentId.toUpperCase()}_${orderId}`;
};

@Component({
  template: '',
})
export class AppBaseComponent<T, U> {
  public appType: string;
  public configId: string;
  public inputAppData: InputAppDto;
  public isFirstLoading$ = new BehaviorSubject(true);
  public isConfigReady = new BehaviorSubject<boolean>(false);
  public isConfigReady$ = this.isConfigReady.pipe(filter((status) => status));

  private appStateService: AppStateService<T, U>;
  private appStateQuery: AppStateQuery<T, U>;
  private cfAppStateService: CfAppStateService;
  private locationService: LocationService;
  private localStorageService: LocalStorageService;
  private appNavigationRuleService: AppNavigationRuleService;
  private loadService: LoadService;
  private configService: ConfigService;
  private configApiService: ConfigApiService;
  private cdr: ChangeDetectorRef;
  private ngUnsubscribe$: UnsubscribeService;
  private isCoreConfigLoaded$;
  private eventBusService: EventBusService;
  private storeSub;
  private eventSub;

  constructor(public injector: Injector) {
    this.appStateService = this.injector.get(AppStateService);
    this.appStateQuery = this.injector.get(AppStateQuery);
    this.cfAppStateService = this.injector.get(CfAppStateService);
    this.locationService = this.injector.get(LocationService);
    this.localStorageService = this.injector.get(LocalStorageService);
    this.appNavigationRuleService = this.injector.get(AppNavigationRuleService);
    this.eventBusService = this.injector.get(EventBusService);
    this.loadService = this.injector.get(LoadService);
    this.configService = this.injector.get(ConfigService);
    this.configApiService = this.injector.get(ConfigApiService);
    this.cdr = this.injector.get(ChangeDetectorRef);
    this.ngUnsubscribe$ = this.injector.get(UnsubscribeService);
    this.eventSub = this.eventBusService.on('closeApp').subscribe((isPrevStepCase: boolean) => {
      this.closeApp(isPrevStepCase);
    });
    this.isCoreConfigLoaded$ = this.loadService.loaded.pipe(filter((loaded: boolean) => loaded));
  }

  openApp(): void {
    this.initAppConfig();
  }

  closeApp(isPrevStepCase: boolean = false): void {
    this.setOutputAppData(isPrevStepCase);
    this.disableStorageSynchronization();
    this.redirectToCf();
  }

  private initAppConfig(): void {
    this.isCoreConfigLoaded$
      .pipe(
        tap(() => {
          this.configService.configId = this.configId;
          this.configService.initCore();
        }),
        mergeMap(() => this.configApiService.getFormPlayerConfig()),
        take(1),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((config) => {
        this.configService.config = config;
        this.setInputAppData();
        this.initializeAppState();
        this.enableStorageSynchronization();
        this.isConfigReady.next(true);
        this.cdr.markForCheck();
      });
  }

  private setInputAppData(): void {
    const inputAppData = this.cfAppStateService.getState<InputAppDto>(DataDirectionType.INPUT);

    if (inputAppData.componentType !== this.appType) {
      throw new Error(
        `Looks like we have some issues.
         Current app type is: ${this.appType}.
         Input data type is: ${inputAppData.componentType}`,
      );
    }

    this.inputAppData = inputAppData;
  }

  private initializeAppState(): void {
    const stateFromStorage = this.getStateFromLocalStorage();
    let initState: AppState<T, U>;

    if (stateFromStorage) {
      initState = stateFromStorage;
    } else {
      try {
        initState = JSON.parse(this.inputAppData.value) as AppState<T, U>;
        if (this.inputAppData?.healthPayload) {
          initState.healthPayload = this.inputAppData.healthPayload;
        }

        if (!initState.value) {
          initState.value = {} as T;
        }

        if (!initState.state) {
          initState.state = {} as U;
        }

        if (this.inputAppData.isPrevStepCase) {
          initState.currentComponent = this.appNavigationRuleService.getLast();
        } else {
          initState.currentComponent = this.appNavigationRuleService.getFirst();
        }
      } catch (_) {
        throw new Error(
          `Looks like we have some issues. We can't parse string: "${this.inputAppData.value}"`,
        );
      }
    }

    this.appStateService.initialize(initState);
  }

  private getStateFromLocalStorage(): AppState<T, U> {
    const key = this.getStorageKey();
    let stateFromStorage;

    try {
      stateFromStorage = this.localStorageService.get<AppState<T, U>>(key);
    } catch (_) {
      stateFromStorage = null;
    }

    return stateFromStorage;
  }

  private getStorageKey(): string {
    return getAppStorageKey(
      this.inputAppData.componentType,
      this.inputAppData.componentId,
      this.inputAppData.orderId,
    );
  }

  private setOutputAppData(isPrevStepCase: boolean): void {
    const { value, state } = this.appStateQuery;
    const outputAppData: OutputAppDto = {
      componentId: this.inputAppData.componentId,
      componentType: this.inputAppData.componentType,
      value: JSON.stringify({ value, state }),
      isPrevStepCase,
    };
    this.cfAppStateService.setState<OutputAppDto>(outputAppData, DataDirectionType.OUTPUT);
  }

  private redirectToCf(): void {
    this.locationService.href(this.inputAppData.callbackRedirectUrl);
  }

  private enableStorageSynchronization(): void {
    const key = this.getStorageKey();
    this.storeSub = this.appStateQuery.store$.subscribe((storeState) => {
      this.localStorageService.set<AppState<T, U>>(key, storeState);
    });
    this.isFirstLoading$.next(false);
  }

  private disableStorageSynchronization(): void {
    const key = this.getStorageKey();
    this.storeSub.unsubscribe();
    this.eventSub.unsubscribe();
    this.localStorageService.delete(key);
  }
}
