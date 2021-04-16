import { Injectable } from '@angular/core';
import { CachedAnswers } from '../../../screen/screen.types';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import { CustomScreenComponentTypes } from '../../../component/custom-screen/components-list.types';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { ComponentDto } from 'epgu-constructor-types/dist/base/component-dto';

// TODO нужно утащить на backend (HARDCODE from backend)
export const componentsNoCache: Array<string> = [
  UniqueScreenComponentTypes.carInfo,
  UniqueScreenComponentTypes.carOwnerInfo,
  UniqueScreenComponentTypes.confirmPersonalUserPhone,
  UniqueScreenComponentTypes.confirmPersonalUserEmail,
  UniqueScreenComponentTypes.paymentScr,
  UniqueScreenComponentTypes.timeSlot,
  UniqueScreenComponentTypes.timeSlotWithComputableDepartment,
  UniqueScreenComponentTypes.unusedPayments,
  UniqueScreenComponentTypes.carList,
];

@Injectable()
export class CachedAnswersService {

  getCachedValueById(answers: CachedAnswers, id: string): string | null{
    return answers[id]?.value || null;
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
    if (!UtilsService.hasJsonStructure(cachedValue)) {
      throw Error('Cached value should be JSON string');
    }

    const parsedValue = JSON.parse(cachedValue);

    if (component.type === UniqueScreenComponentTypes.childrenList) {
      const childComponents = component.attrs.components;

      for (const childCache of parsedValue) {
        for (const childComponentId in childCache) {
          const childComponent = childComponents.find(item => item.id === childComponentId);
          if (childComponent?.type === CustomScreenComponentTypes.SnilsInput) {
            childCache[childComponentId] = childCache[childComponentId].snils;
          }
        }
      }
    }

    return parsedValue;
  }
}
