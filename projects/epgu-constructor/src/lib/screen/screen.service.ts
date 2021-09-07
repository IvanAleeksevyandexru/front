import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PrepareComponentsService } from '../shared/services/prepare-components/prepare-components.service';
import { CurrentAnswersService } from './current-answers.service';
import { ScreenContent } from './screen-content';
import { ScreenStore, ScreenStoreComponentDtoI } from './screen.types';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { NotifierDisclaimerService } from '../shared/services/notifier/notifier.service';

@Injectable()
export class ScreenService extends ScreenContent {
  public get isLoading$(): Observable<boolean> {
    return this.isLoadingSubject.asObservable();
  }

  public isLoaderVisible = new BehaviorSubject<boolean>(false);

  private screenStore: ScreenStore = {};
  private isLoading = false;
  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);

  constructor(
    private currentAnswersService: CurrentAnswersService,
    private deviceDetectorService: DeviceDetectorService,
    private prepareComponentsService: PrepareComponentsService,
    private notifierDisclaimerService: NotifierDisclaimerService,
  ) {
    super();
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

  public getComponentByIndex(index: number): ComponentDto {
    return this.display?.components[index];
  }

  public getCompValueFromCachedAnswers(componentId?: string): string {
    const cachedAnswers = this.getStore().cachedAnswers;
    if (!componentId) {
      componentId = this.component?.id;
    }
    return cachedAnswers && cachedAnswers[componentId]?.value;
  }

  public setCompValueToCachedAnswer(componentId: string, value: string): void {
    const cachedAnswers = this.getStore().cachedAnswers || this.cachedAnswers;
    if (!componentId) {
      componentId = this.component?.id;
    }

    cachedAnswers[componentId] = { ...cachedAnswers[componentId], value };
  }

  /**
   * Инициализирует работу хранилища
   * @param store - объект хранилища
   */
  public initScreenStore(store: ScreenStore): void {
    this.screenStore = store;
    this.prepareComponents();
    this.initComponentStateService();
    this.updateScreenContent(store, this.deviceDetectorService.isWebView);
    this.initNotifierDisclaimers();
  }

  /**
   * Установка выбранных данных на экране
   * @param newState - данные ответа
   */
  public updateScreenStore(newState: ScreenStore): void {
    this.screenStore = { ...this.screenStore, ...newState };
    this.updateScreenContent(this.screenStore, this.deviceDetectorService.isWebView);
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

  private initNotifierDisclaimers(): void {
    const disclaimers = this.screenStore.disclaimers || [];
    if (!disclaimers.length) return;

    disclaimers.forEach((disclaimer) => {
      const { level, title, message, id: notifierId } = disclaimer;
      const type = level.toLocaleLowerCase();
      setTimeout(() => {
        this.notifierDisclaimerService.open({
          notifierId,
          title,
          message,
          type,
        });
      });
    });
  }

  private prepareComponents(): void {
    const components = this.screenStore.display.components;
    const cashedAnswers = this.screenStore.cachedAnswers;
    const applicantAnswers = this.screenStore.applicantAnswers;
    const screenStoreComponent = this.prepareComponentsService.prepareComponents(components, {
      ...cashedAnswers,
      ...applicantAnswers,
    });

    if (screenStoreComponent.length) {
      this.screenStore.display = { ...this.screenStore.display, components: screenStoreComponent };
    }
  }
}
