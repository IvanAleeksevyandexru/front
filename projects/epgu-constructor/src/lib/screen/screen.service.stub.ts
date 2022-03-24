import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScreenStore, ScreenStoreComponentDtoI } from './screen.types';
import { ScreenContent } from './screen-content';
import { CachedAnswersDto, ComponentDto, DisplayDto } from '@epgu/epgu-constructor-types';

@Injectable()
export class ScreenServiceStub extends ScreenContent {
  public screenStore: ScreenStore = ({ cachedAnswers: [] } as unknown) as CachedAnswersDto;

  private isLoading = false;

  private isShown = true; // Показываем или нет кнопку

  // @ts-ignore
  public display$: Observable<DisplayDto>;

  // @ts-ignore
  public component$: Observable<ComponentDto>;

  public isLoadingSubject = new BehaviorSubject<boolean>(false);

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  public isLoaderVisible = new BehaviorSubject<boolean>(false);

  public initScreenStore(store: ScreenStore): void {
    this.screenStore = store;
    this.updateScreenContent(store, false);
  }

  public updateScreenStore(newState: ScreenStore): void {}

  public updateLoading(isLoading: boolean): void {}

  private initComponentStateService() {}

  private loadValueFromCachedAnswer(): void {}

  public getStore(): ScreenStore {
    return this.screenStore;
  }

  public getComponentByIndex(index: number): ComponentDto {
    return this.display?.components[index];
  }

  public getCompValueFromCachedAnswers(componentId?: string): string {
    const { cachedAnswers } = this.getStore();
    if (!componentId) {
      componentId = this.component?.id;
    }
    return cachedAnswers && cachedAnswers[componentId]?.value;
  }

  public getCompValueFromApplicantAnswers(componentId?: string): string {
    const { applicantAnswers } = this.getStore();
    if (!componentId) {
      componentId = this.component?.id;
    }
    return applicantAnswers && applicantAnswers[componentId]?.value;
  }

  public getCompValueFromApplicantAndCachedAnswers(componentId?: string): string {
    const { cachedAnswers, applicantAnswers } = this.getStore();
    const store = { ...applicantAnswers, ...cachedAnswers };
    if (!componentId) {
      componentId = this.component?.id;
    }
    return store && store[componentId]?.value;
  }

  public setCompValueToCachedAnswer(componentId: string, value: string): void {
    const { cachedAnswers } = this.getStore();
    if (!componentId) {
      componentId = this.component?.id;
    }

    cachedAnswers[componentId] = { ...cachedAnswers[componentId], value };
  }

  public getCompFromDisplay(componentId: string = this.component.id): ScreenStoreComponentDtoI {
    return {
      attrs: {},
    } as ScreenStoreComponentDtoI;
  }
}
