import { Component, Injector } from '@angular/core';
import {
  AppState,
  DataDirectionType,
  InputAppDto,
  OutputAppDto,
} from '@epgu/epgu-constructor-types';
import { AppStateService } from '../app-state/app-state.service';
import { CfAppStateService } from '../../core/services/cf-app-state/cf-app-state.service';
import { AppStateQuery } from '../app-state/app-state.query';
import { LocationService } from '../../core/services/location/location.service';
import { LocalStorageService } from '../../core/services/local-storage/local-storage.service';

@Component({
  template: '',
})
export class AppBaseComponent<T, U> {
  public appType: string;
  public inputAppData: InputAppDto;

  private appStateService: AppStateService<T, U>;
  private appStateQuery: AppStateQuery<T, U>;
  private cfAppStateService: CfAppStateService;
  private locationService: LocationService;
  private localStorageService: LocalStorageService;
  private storeSub;

  constructor(public injector: Injector) {
    this.appStateService = this.injector.get(AppStateService);
    this.appStateQuery = this.injector.get(AppStateQuery);
    this.cfAppStateService = this.injector.get(CfAppStateService);
    this.locationService = this.injector.get(LocationService);
    this.localStorageService = this.injector.get(LocalStorageService);
  }

  openApp(): void {
    this.setInputAppData();
    this.initializeAppState();
    this.enableStorageSynchronization();
  }

  closeApp(isPrevStepCase: boolean = false): void {
    this.setOutputAppData(isPrevStepCase);
    this.disableStorageSynchronization();
    this.redirectToCf();
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
      } catch (_) {
        initState = { value: null, state: null };
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
    return `APP_STORAGE_${this.inputAppData.componentType.toUpperCase()}_${this.inputAppData.componentId.toUpperCase()}`;
  }

  private setOutputAppData(isPrevStepCase: boolean): void {
    const { storeState } = this.appStateQuery;
    const outputAppData: OutputAppDto = {
      componentId: this.inputAppData.componentId,
      componentType: this.inputAppData.componentType,
      value: JSON.stringify(storeState),
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
  }

  private disableStorageSynchronization(): void {
    const key = this.getStorageKey();
    this.storeSub.unsubscribe();
    this.localStorageService.delete(key);
  }
}
