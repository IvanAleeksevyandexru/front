import { Injectable } from '@angular/core';
import { ComponentBase, ScreenStore, ScreenStoreComponentDtoI } from './screen.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { CachedAnswersService } from '../shared/services/applicant-answers/cached-answers.service';
import { CurrentAnswersService } from './current-answers.service';
import { ScreenContent } from './screen-content';
import { CustomScreenComponentTypes } from '../component/components-list/components-list.types';
import { ComponentDto } from '../form-player/services/form-player-api/form-player-api.types';
import { UtilsService } from '../shared/services/utils/utils.service';

@Injectable()
export class ScreenService extends ScreenContent {
  private screenStore: ScreenStore = {};
  private isLoading = false;

  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

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
  private initComponentStateService() {
    this.currentAnswersService.state = '';
    this.currentAnswersService.isValid = true;
  }

  private loadValueFromCachedAnswer(): void {
    const components: Array<ComponentBase> = [];

    this.screenStore.display.components
      .forEach(item => {
        const shouldBeTakenFromTheCache = this.cachedAnswersService.shouldBeTakenFromTheCache(item); // TODO костыль от backend(-a);
        const hasPresetTypeRef = item.attrs?.preset?.type === 'REF';

        if (hasPresetTypeRef && shouldBeTakenFromTheCache) {
          const component = this.getPresetValue(item);
          components.push(component);
          return;
        }

        const cachedValue = shouldBeTakenFromTheCache && this.cachedAnswersService
          .getCachedValueById(this.screenStore.cachedAnswers, item.id);
        item.presetValue = item.value;
        const component = cachedValue ? { ...item, value: this.mergePresetCacheValue(cachedValue, item.value, item.type) } : item;
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
  private mergePresetCacheValue(cachedValue: string, preset: string, componentType: string ) {
    if (componentType === CustomScreenComponentTypes.SnilsInput) {
      return JSON.parse(cachedValue).snils;
    }
    const isPresetParseable = preset.substr(0, 1) === '{';
    if (isPresetParseable) {
      return JSON.stringify({
        ...JSON.parse(preset),
        ...JSON.parse(cachedValue),
      });
    }
    return cachedValue || preset;
  }

  /**
   * Возвращает хранилище данных для экрана
   */
  public getStore(): ScreenStore {
    return this.screenStore;
  }

  /**
   * Возвращает данные из cachedAnswers, если в JSON есть preset.type = REF
   */
  private getPresetValue(item: ComponentDto): ComponentDto {
    const [id, path] = item.attrs.preset.value.split(/\.(.+)/);
    const cachedValue = this.cachedAnswersService
      .getCachedValueById(this.screenStore.cachedAnswers, id) || '{}';
    const value = UtilsService.getObjectProperty(JSON.parse(cachedValue), path, item.value);

    return { ...item, value };
  }

  public getCompFromDisplay(componentId: string): ScreenStoreComponentDtoI {
    const component = this.display?.components.find((comp) => comp.id === componentId);
    return component;
  }

  public getCompValueFromCachedAnswers(componentId: string) {
    const cachedAnswers = this.getStore().cachedAnswers;
    return cachedAnswers && cachedAnswers[componentId]?.value;
  }
}
