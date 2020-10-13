import { Injectable } from '@angular/core';
import { ComponentBase, ScreenStore } from './screen.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { CachedAnswersService } from '../shared/services/applicant-answers/cached-answers.service';
import { CurrentAnswersService } from './current-answers.service';
import { ScreenContent } from './screen-content';

@Injectable()
export class ScreenService extends ScreenContent {
  private screenStore: ScreenStore;
  private isLoading = false;
  private isShown = true; // Показываем или нет кнопку

  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);
  private isShownSubject = new BehaviorSubject<boolean>(this.isShown);
  private screenStoreSubject = new BehaviorSubject<ScreenStore>(this.screenStore);

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public isShown$: Observable<boolean> = this.isShownSubject.asObservable();

  constructor(
    private currentAnswersService: CurrentAnswersService,
    private cachedAnswersService: CachedAnswersService,
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
    this.screenStoreSubject.next(this.screenStore);
    this.updateScreenContent(store);
  }

  /**
   * Установка выбранных данных на экране
   * @param newState - данные ответа
   */
  public updateScreenStore(newState: ScreenStore): void {
    this.screenStore = { ...this.screenStore, ...newState };
    this.screenStoreSubject.next(this.screenStore);
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
  private initComponentStateService() {
    this.currentAnswersService.state = '';
    this.currentAnswersService.isValid = true;
  }

  private loadValueFromCachedAnswer(): void {
    const components: Array<ComponentBase> = [];

    this.screenStore.display.components
      .filter(this.cachedAnswersService.shouldBeTakenFromTheCache) // TODO HARDCODE from backend;
      .forEach(item => {
        const cachedValue = this.cachedAnswersService
          .getCachedValueById(this.screenStore.cachedAnswers, item.id);

      const component = cachedValue ? { ...item, value: this.mergePresetCacheValue(cachedValue, item.value) } : item;
      components.push(component);
    });

    if (components.length) {
      this.screenStore.display = { ...this.screenStore.display, components };
    }
  }

  /**
   * Метод объединяет preset значение и ответ из кэша
   * @param cachedValue - кэш ответов из cachedAnswersService
   * @param preset - preset значения из display.components[].value
   */
  private mergePresetCacheValue(cachedValue: string, preset: string) {
    if (!preset) {
      return cachedValue;
    }
    return JSON.stringify({
      ...JSON.parse(preset),
      ...JSON.parse(cachedValue),
    });
  }

  /**
   * Обновляет статус показывать кнопку или нет
   * @param val - показывать кнопку?
   */
  public updateIsShown(val: boolean): void {
    this.isShown = val;
    this.isShownSubject.next(val);
  }

  /**
   * Возвращает хранилище данных для экрана
   */
  public getStore(): ScreenStore {
    return this.screenStore;
  }
}
