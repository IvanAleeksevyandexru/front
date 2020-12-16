import { Injectable } from '@angular/core';

import { ComponentDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { CachedAnswersService } from '../cached-answers/cached-answers.service';
import { CachedAnswers, ScreenStoreComponentDtoI } from '../../../screen/screen.types';
import { CustomScreenComponentTypes } from '../../../component/components-list/components-list.types';
import { UtilsService } from '../../../core/services/utils/utils.service';

@Injectable()
export class ValueLoaderService {
  private repeatableFields = 'RepeatableFields';
  constructor(private cachedAnswersService: CachedAnswersService, private utils: UtilsService) {}

  public loadValueFromCachedAnswer(
    components: Array<ComponentDto>,
    cachedAnswers: CachedAnswers,
  ): Array<ScreenStoreComponentDtoI> {
    return components.map((item) => {
      if (item.type === this.repeatableFields) {
        const repeatableFieldsComponents = this.setRepeatableFields(
          item.attrs.components,
          cachedAnswers,
          item,
        );

        item.attrs.repeatableComponents = [
          ...(item.attrs.repeatableComponents || []),
          ...repeatableFieldsComponents,
        ];

        return item;
      }

      const hasPresetTypeRef = item.attrs?.preset?.type === 'REF';
      const cachedValue = this.getCache(item.type, item.id, cachedAnswers);

      if (hasPresetTypeRef && !cachedValue) {
        return this.getPresetValue(item, cachedAnswers);
      }

      return this.getComponentWithCaches(item, cachedValue);
    });
  }

  private setRepeatableFields(
    components: Array<ComponentDto>,
    cachedAnswers: CachedAnswers,
    parentComponent: ComponentDto,
  ): Array<Array<ComponentDto>> {
    const cachedValue = this.getCache(parentComponent.type, parentComponent.id, cachedAnswers);
    const cachedValueArray: Array<{ [key: string]: string }> = JSON.parse(cachedValue) || [];

    if (cachedValueArray.length) {
      let repeatableFieldComponents: Array<Array<ComponentDto>> = [];
      cachedValueArray.forEach((component, index) => {
        repeatableFieldComponents.push(
          this.getCacheRepeatableField(components, cachedAnswers, parentComponent, index),
        );
      });

      return repeatableFieldComponents;
    } else {
      return [this.getCacheRepeatableField(components, cachedAnswers, parentComponent, 0)];
    }
  }

  private getCacheRepeatableField(
    components: Array<ComponentDto>,
    cachedAnswers: CachedAnswers,
    parentComponent: ComponentDto,
    index: number,
  ): Array<ComponentDto> {
    return components.map((item) => {
      const hasPresetTypeRef = item.attrs?.preset?.type === 'REF';
      const cachedValue = this.getCache(item.type, parentComponent.id, cachedAnswers);

      if (hasPresetTypeRef && !cachedValue) {
        return this.getPresetValue(item, cachedAnswers);
      }

      return this.getComponentWithCaches(item, cachedValue, index);
    });
  }

  /**
   * Метод объединяет preset значение и ответ из кэша
   * @param cachedValue - кэш ответов из cachedAnswersService
   * @param preset - preset значения из display.components[].value
   * @param componentType
   * @param componentId - id от родительского компонента для RepeatableField
   * @param parentIndex - индекс для взятие из кэша для RepeatableField
   */
  private mergePresetCacheValue(
    cachedValue: string,
    preset: string,
    componentType: string,
    componentId: string,
    parentIndex?: number,
  ): string {
    if (componentType === CustomScreenComponentTypes.SnilsInput) {
      return JSON.parse(cachedValue).snils;
    }

    const isPresetParsable = this.utils.hasJsonStructure(preset);
    const isCachedValueParsable = this.utils.hasJsonStructure(cachedValue);

    if (isPresetParsable && isCachedValueParsable) {
      return JSON.stringify({
        ...JSON.parse(preset),
        ...JSON.parse(cachedValue),
      });
    }

    if (componentId && isCachedValueParsable) {
      const value = JSON.parse(cachedValue);

      return value[parentIndex][componentId];
    }

    return cachedValue || preset;
  }

  /**
   * Возвращает данные из cachedAnswers, если в JSON есть preset.type = REF
   * TODO нужно утащить на backend (HARDCODE from backend)
   */
  private getPresetValue(item: ComponentDto, cachedAnswers: CachedAnswers): ComponentDto {
    const [id, path] = item.attrs.preset.value.split(/\.(.+)/);
    const cachedValue = JSON.parse(
      this.cachedAnswersService.getCachedValueById(cachedAnswers, id) || '{}',
    );
    const value = UtilsService.getObjectProperty(cachedValue, path, item.value);

    return typeof value === 'object'
      ? { ...item, value: JSON.stringify(value) }
      : { ...item, value };
  }

  private getCache(type: string, id: string, cachedAnswers: CachedAnswers): string | null {
    const shouldBeTakenFromTheCache = this.cachedAnswersService.shouldBeTakenFromTheCache(type); // TODO костыль от backend(-a);

    return shouldBeTakenFromTheCache
      ? this.cachedAnswersService.getCachedValueById(cachedAnswers, id)
      : null;
  }

  private getComponentWithCaches(
    item: ComponentDto,
    cachedValue: string,
    parentIndex?: number,
  ): ComponentDto {
    const component = {
      ...item,
      presetValue: item.value,
    };

    if (cachedValue) {
      return {
        ...component,
        value: this.mergePresetCacheValue(
          cachedValue,
          component.value,
          component.type,
          item.id,
          parentIndex,
        ),
      };
    }

    return component;
  }
}
