import { Injectable } from '@angular/core';
import { CachedAnswers } from '../../../screen/screen.types';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import { CustomScreenComponentTypes } from '../../../component/custom-screen/components-list.types';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { LocalStorageService } from '@epgu/epgu-constructor-ui-kit';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';

// TODO нужно утащить на backend (HARDCODE from backend)
export const componentsNoCache: string[] = [
  UniqueScreenComponentTypes.carInfo,
  UniqueScreenComponentTypes.carOwnerInfo,
  UniqueScreenComponentTypes.confirmPersonalUserPhone,
  UniqueScreenComponentTypes.confirmPersonalUserEmail,
  UniqueScreenComponentTypes.paymentScr,
  UniqueScreenComponentTypes.timeSlot,
  UniqueScreenComponentTypes.timeSlotWithComputableDepartment,
  UniqueScreenComponentTypes.unusedPayments,
  UniqueScreenComponentTypes.carList,
  UniqueScreenComponentTypes.carDetailInfo,
];

@Injectable()
export class CachedAnswersService {
  private localStorageKey = 'cachedAnswers';

  constructor(
    private localStorageService: LocalStorageService,
    private jsonHelperService: JsonHelperService,
  ) {}

  getCachedValueById(answers: CachedAnswers, id: string): string | null {
    return answers[id]?.value || null;
  }

  getCachedValueFromLocalStorage(id: string): string | null {
    const state = this.localStorageService.get<Record<string, unknown> | null>(
      this.localStorageKey,
    );

    if (state && state[id]) {
      return JSON.stringify(state[id]);
    }
    return null;
  }

  setValueToLocalStorage<T>(id: string, value: T): void {
    const allComponentsState = this.localStorageService.get<Record<string, unknown> | null>(
      this.localStorageKey,
    );

    this.localStorageService.set<Record<string, unknown>>(this.localStorageKey, {
      ...allComponentsState,
      [id]: value,
    });
  }

  removeValueFromLocalStorage(id: string): void {
    const allComponentsState = this.localStorageService.get<Record<string, unknown> | null>(
      this.localStorageKey,
    );

    if (allComponentsState) {
      delete allComponentsState[id];
      this.localStorageService.set<Record<string, unknown>>(
        this.localStorageKey,
        allComponentsState,
      );
    }
  }

  // TODO нужно утащить на backend (HARDCODE from backend)
  shouldBeTakenFromTheCache(type: string): boolean {
    return !componentsNoCache.includes(type);
  }

  /**
   * Парсит JSON строку из cachedAnswers и возвращает значение в том формате, в котором оно хранится в display.components
   * @param cachedValue - кэш ответов
   * @param component - компонент из display.components
   */
  parseCachedValue<T = unknown>(cachedValue: string, component: ComponentDto): T {
    if (!this.jsonHelperService.hasJsonStructure(cachedValue)) {
      throw Error('Cached value should be JSON string');
    }

    const parsedValue = JSON.parse(cachedValue);

    if (component.type === UniqueScreenComponentTypes.childrenList) {
      const childComponents = component.attrs.components;

      for (const childCache of parsedValue) {
        for (const childComponentId in childCache) {
          const childComponent = childComponents.find((item) => item.id === childComponentId);
          if (childComponent?.type === CustomScreenComponentTypes.SnilsInput) {
            childCache[childComponentId] = childCache[childComponentId].snils;
          }
        }
      }
    }

    return parsedValue;
  }
}
