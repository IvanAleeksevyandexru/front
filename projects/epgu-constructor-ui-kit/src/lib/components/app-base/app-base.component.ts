import { Component, Injector } from '@angular/core';
import {
  AppState,
  DataDirectionType,
  InputAppDto,
  OutputAppDto,
} from '@epgu/epgu-constructor-types';
import { AppStateService } from '../../services/app-state/app-state.service';
import { CfAppStateService } from '../../services/cf-app-state/cf-app-state.service';
import { AppStateQuery } from '../../services/app-state/app-state.query';
import { LocationService } from '../../services/location/location.service';

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

  constructor(public injector: Injector) {
    this.appStateService = this.injector.get(AppStateService);
    this.appStateQuery = this.injector.get(AppStateQuery);
    this.cfAppStateService = this.injector.get(CfAppStateService);
    this.locationService = this.injector.get(LocationService);
  }

  openApp(): void {
    this.setInputAppData();
    this.initializeAppState();
  }

  closeApp(): void {
    this.setOutputAppData();
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
    let initState: AppState<T, U>;
    try {
      initState = JSON.parse(this.inputAppData.value) as AppState<T, U>;
    } catch (_) {
      initState = { value: null, state: null };
    }

    this.appStateService.initialize(initState);
  }

  private setOutputAppData(): void {
    const { storeState } = this.appStateQuery;
    const outputAppData: OutputAppDto = {
      componentId: this.inputAppData.componentId,
      componentType: this.inputAppData.componentType,
      value: JSON.stringify(storeState),
      isPrevStepCase: false, // TODO: нужно продумать механизм для apps
    };
    this.cfAppStateService.setState<OutputAppDto>(outputAppData, DataDirectionType.OUTPUT);
  }

  private redirectToCf(): void {
    this.locationService.href(this.inputAppData.callbackRedirectUrl);
  }
}
