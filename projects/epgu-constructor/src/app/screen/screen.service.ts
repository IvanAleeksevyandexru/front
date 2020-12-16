import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CustomScreenComponentTypes } from '../component/components-list/components-list.types';
import { ComponentDto } from '../form-player/services/form-player-api/form-player-api.types';
import { CachedAnswersService } from '../shared/services/cached-answers/cached-answers.service';
import { UtilsService } from '../core/services/utils/utils.service';
import { CurrentAnswersService } from './current-answers.service';
import { ScreenContent } from './screen-content';
import { ScreenStore, ScreenStoreComponentDtoI } from './screen.types';
import { ValueLoaderService } from '../shared/services/value-loader/value-loader.service';

@Injectable()
export class ScreenService extends ScreenContent {
  private screenStore: ScreenStore = {};
  private isLoading = false;

  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public isFirstLoading$: Observable<boolean> = this.isLoadingSubject.asObservable().pipe(take(3));

  constructor(
    private currentAnswersService: CurrentAnswersService,
    private cachedAnswersService: CachedAnswersService,
    private utils: UtilsService,
    private valueLoaderService: ValueLoaderService,
  ) {
    super();
  }

  /**
   * Инициализирует работу хранилища
   * @param store - объект хранилища
   */
  public initScreenStore(store: ScreenStore): void {
    this.screenStore = store;
    this.loadValueFromCachedAnswer();
    this.initComponentStateService();
    this.updateScreenContent(store);
  }

  /**
   * Установка выбранных данных на экране
   * @param newState - данные ответа
   */
  public updateScreenStore(newState: ScreenStore): void {
    this.screenStore = { ...this.screenStore, ...newState };
    this.updateScreenContent(newState);
  }

  /**
   * Обновляет статус "в загрузке" для кнопки
   * @param isLoading - показывать загрузку?
   */
  public updateLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.isLoadingSubject.next(this.isLoading);
  }

  /**
   * Инициализирует начальное состояние ответа компонента
   * @private
   */
  private initComponentStateService(): void {
    this.currentAnswersService.state = '';
    this.currentAnswersService.isValid = true;
  }

  private loadValueFromCachedAnswer(): void {
    const components = this.screenStore.display.components;
    const cashedAnswers = this.screenStore.cachedAnswers;
    const screenStoreComponent = this.valueLoaderService.loadValueFromCachedAnswer(components, cashedAnswers);

    if (screenStoreComponent.length) {
      this.screenStore.display = { ...this.screenStore.display, components: screenStoreComponent };
    }
  }

  /**
   * Возвращает хранилище данных для экрана
   */
  public getStore(): ScreenStore {
    return this.screenStore;
  }

  public getCompFromDisplay(componentId: string): ScreenStoreComponentDtoI {
    return this.display?.components.find((comp) => comp.id === componentId);
  }

  public getCompValueFromCachedAnswers(componentId?: string): string {
    const cachedAnswers = this.getStore().cachedAnswers;
    if (!componentId) {
      componentId = this.component?.id;
    }
    return cachedAnswers && cachedAnswers[componentId]?.value;
  }
}
