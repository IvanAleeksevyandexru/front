import { Injectable } from '@angular/core';
import { ScreenStore } from './screen.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScreenContent } from './screen-content';
import {
  ComponentDto,
  DisplayDto,
} from '../form-player/services/form-player-api/form-player-api.types';

@Injectable()
export class ScreenServiceStub extends ScreenContent {
  private screenStore: ScreenStore;
  private isLoading = false;
  private isShown = true; // Показываем или нет кнопку

  public display$: Observable<DisplayDto>;
  public component$: Observable<ComponentDto>;

  public isLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject$.asObservable();

  public get componentValue(): string {
    return '';
  }

  public initScreenStore(store: ScreenStore): void {}

  public updateScreenStore(newState: ScreenStore): void {}

  public updateLoading(isLoading: boolean): void {}

  private initComponentStateService() {}

  private loadValueFromCachedAnswer(): void {}

  public getStore() {
    return { cachedAnswers: [] };
  }
}
