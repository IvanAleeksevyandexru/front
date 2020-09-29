import { Injectable } from '@angular/core';
import { ComponentBase, ScreenStore } from './screen.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { CachedAnswersService } from '../shared/services/applicant-answers/cached-answers.service';
import { ComponentStateService } from '../services/component-state/component-state.service';


@Injectable()
export class ScreenService {
  private screenStore: ScreenStore;
  private isLoading = false;
  private isShown = true; // Показываем или нет кнопку

  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);
  private isShownSubject = new BehaviorSubject<boolean>(this.isShown);
  private screenStoreSubject = new BehaviorSubject<ScreenStore>(this.screenStore);

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public isShown$: Observable<boolean> = this.isShownSubject.asObservable();
  public screenData$: Observable<ScreenStore> = this.screenStoreSubject.asObservable();

  constructor (
    private cachedAnswersService: CachedAnswersService,
    private componentStateService: ComponentStateService,
  ) {}

  /**
   * Инициализирует работу хранилища
   * @param store - объект хранилища
   */
  public initScreenStore(store: ScreenStore): void {
    this.screenStore = store;
    this.loadValueFromCachedAnswer();
    this.initComponentStateService();
    this.screenStoreSubject.next(this.screenStore);
  }

  /**
   * Установка выбранных данных на экране
   * @param newState - данные ответа
   */
  public updateScreenStore(newState: ScreenStore): void {
    this.screenStore = { ...this.screenStore, ...newState };
    this.screenStoreSubject.next(this.screenStore);
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
    this.componentStateService.state = '';
    this.componentStateService.isValid = true;
  }

  private loadValueFromCachedAnswer(): void {
    const components: Array<ComponentBase> = [];

    // if (Object.keys(this.screenStore.errors).length) {
    //   console.log('ScreenStore patched from a CurrentValue');
    //   this.screenStore.display.components.forEach((item: ComponentBase) => {
    //     components.push(
    //       this.getUpdatedComponentByValue(
    //         this.screenStore.currentValue[item.id]?.value,
    //         item,
    //       )
    //     );
    //   });
    // } else {
      console.log('ScreenStore patched from an CachedAnswers');
      this.screenStore.display.components.forEach((item: ComponentBase) => {
        components.push(
          this.getUpdatedComponentByValue(
            this.cachedAnswersService.getCachedValueById(
              this.screenStore.cachedAnswers,
              item.id,
            ),
            item,
          )
        );
      });
    // }

    this.screenStore.display = { ...this.screenStore.display, components };
  }

  private getUpdatedComponentByValue(value: string, component: ComponentBase): ComponentBase {
    return value ? { ... component, value } : component;
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
