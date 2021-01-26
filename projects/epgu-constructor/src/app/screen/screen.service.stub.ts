import { Injectable } from '@angular/core';
import { ScreenStore } from './screen.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScreenContent } from './screen-content';
import {
  CachedAnswersDto,
  ComponentDto,
  DisplayDto,
} from '../form-player/services/form-player-api/form-player-api.types';

@Injectable()
export class ScreenServiceStub extends ScreenContent {
  private screenStore: ScreenStore = { cachedAnswers: [] } as unknown as CachedAnswersDto;
  private isLoading = false;
  private isShown = true; // Показываем или нет кнопку

  public display$: Observable<DisplayDto>;
  public component$: Observable<ComponentDto>;

  public isLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject$.asObservable();

  public initScreenStore(store: ScreenStore): void {
    this.screenStore = store;
    this.updateScreenContent(store);
  }

  public updateScreenStore(newState: ScreenStore): void {}

  public updateLoading(isLoading: boolean): void {}

  private initComponentStateService() {}

  private loadValueFromCachedAnswer(): void {}

  public getStore(): ScreenStore {
    return this.screenStore;
  }

  public getCompValueFromCachedAnswers(componentId?: string): string {
    const cachedAnswers = this.getStore().cachedAnswers;
    if (!componentId) {
      componentId = this.component?.id;
    }
    return cachedAnswers && cachedAnswers[componentId]?.value;
  }
}
