import { Injectable } from '@angular/core';
import { ScreenStore } from './screen.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScreenContent } from './screen-content';


@Injectable()
export class ScreenServiceStub extends ScreenContent {
  private screenStore: ScreenStore;
  private isLoading = false;
  private isShown = true; // Показываем или нет кнопку

  private isLoadingSubject: BehaviorSubject<boolean>;
  private isShownSubject: BehaviorSubject<boolean>;
  private screenStoreSubject: BehaviorSubject<ScreenStore>;

  public isLoading$: Observable<boolean>;
  public isShown$: Observable<boolean>;
  public screenData$: Observable<ScreenStore>;

  public initScreenStore(store: ScreenStore): void {}


  public updateScreenStore(newState: ScreenStore): void {}

  public updateLoading(isLoading: boolean): void {}

  private initComponentStateService() {}

  private loadAnsweredValues(): void {}

  public updateIsShown(val: boolean): void {}

  public getStore() {}
}