import { Injectable } from '@angular/core';
import { ComponentAttrsDto, ComponentDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { CachedAnswersService } from '../cached-answers/cached-answers.service';
import { CachedAnswers, ScreenStoreComponentDtoI } from '../../../screen/screen.types';
import { CustomScreenComponentTypes } from '../../../component/shared/components/components-list/components-list.types';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { DATE_STRING_DOT_FORMAT } from '../../constants/dates';
import { DocInputField } from '../../../component/shared/components/components-list/doc-input/doc-input.types';


@Injectable()
export class ValueLoaderService {
  private repeatableFields = 'RepeatableFields';

  constructor(
    private cachedAnswersService: CachedAnswersService,
    private utils: UtilsService,
    private datesToolsService: DatesToolsService,
  ) { }

  public loadValueFromCachedAnswer(
    components: Array<ComponentDto>,
    cachedAnswers: CachedAnswers,
  ): Array<ScreenStoreComponentDtoI> {
    return components.map((item) => {
      item.valueFromCache = false;
      if (item.type === this.repeatableFields) {
        const components = item.attrs.components.map((component) =>
          this.getComponentWithAttrsDateRef(component, cachedAnswers),
        );

        const repeatableFieldsComponents = this.setRepeatableFields(
          components,
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
        return this.getPresetValue(
          this.getComponentWithAttrsDateRef(item, cachedAnswers),
          cachedAnswers
        );
      }

      return this.getComponentWithCaches(
        this.getComponentWithAttrsDateRef(item, cachedAnswers),
        cachedValue
      );
    });
  }

  private setRepeatableFields(
    components: Array<ComponentDto>,
    cachedAnswers: CachedAnswers,
    parentComponent: ComponentDto,
  ): Array<Array<ComponentDto>> {
    const cachedValue =
      this.getCache(parentComponent.type, parentComponent.id, cachedAnswers) ||
      parentComponent.value ||
      null;
    const cachedValueArray: Array<{ [key: string]: string }> = JSON.parse(cachedValue) || [];
    if (cachedValueArray.length) {
      let repeatableFieldComponents: Array<Array<ComponentDto>> = [];
      cachedValueArray.forEach((_component, index) => {
        repeatableFieldComponents.push(
          this.getCacheRepeatableField(components, cachedValue, index),
        );
      });
      return repeatableFieldComponents;
    } else {
      return [this.getCacheRepeatableField(components, cachedValue, 0)];
    }
  }

  private getCacheRepeatableField(
    components: Array<ComponentDto>,
    cachedValue: string,
    index: number,
  ): Array<ComponentDto> {
    return components.map((item) => {
      return this.getComponentWithCaches(item, cachedValue, item.id, index);
    });
  }

  /**
   * Метод объединяет preset значение и ответ из кэша
   * @param cachedValue - кэш ответов из cachedAnswersService
   * @param component - компонент из display.components
   * @param parentId - id от родительского компонента для RepeatableField
   * @param parentIndex - индекс для взятие из кэша для RepeatableField
   */
  private mergePresetCacheValue(
    cachedValue: string,
    component: ScreenStoreComponentDtoI,
    parentId?: string,
    parentIndex?: number,
  ): string {
    const preset = component.value;

    if (component.type === CustomScreenComponentTypes.SnilsInput) {
      return JSON.parse(cachedValue).snils;
    }

    const isPresetParsable = this.utils.hasJsonStructure(preset);
    const isCachedValueParsable = this.utils.hasJsonStructure(cachedValue);

    if (isPresetParsable && isCachedValueParsable) {
      const parsedPreset = JSON.parse(preset);
      const parsedCachedValue = this.cachedAnswersService.parseCachedValue(cachedValue, component);

      if (Array.isArray(parsedCachedValue)) {
        return JSON.stringify(parsedCachedValue);
      } else {
        return JSON.stringify({
          ...parsedPreset,
          ...parsedCachedValue as object,
        });
      }
    }

    if (parentId && isCachedValueParsable) {
      const value = this.cachedAnswersService.parseCachedValue(cachedValue, component);

      return value[parentIndex][parentId];
    }

    return cachedValue || preset;
  }

  /**
   * Возвращает данные из cachedAnswers, если в JSON есть preset.type = REF
   * TODO нужно утащить на backend (HARDCODE from backend)
   */
  private getPresetValue(item: ComponentDto, cachedAnswers: CachedAnswers): ComponentDto {
    const { id, path } = this.getPathFromPreset(item.attrs.preset.value);
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
    parentId?: string,
    parentIndex?: number,
  ): ComponentDto {
    const component: ScreenStoreComponentDtoI = {
      ...item,
      presetValue: item.value,
    };

    if (cachedValue) {
      return {
        ...component,
        value: this.mergePresetCacheValue(
          cachedValue,
          component,
          parentId,
          parentIndex,
        ),
        valueFromCache: true
      };
    }

    return component;
  }

  private getLimitDate(cachedAnswers: CachedAnswers, rawPresets: string): string {
    const presets = this.getPresetsFromRawPresets(rawPresets);
    for (let i = 0; i < presets.length; i++) {
      return this.getLimitDateFromPreset(cachedAnswers, presets[i]);
    }
  }

  private getLimitDateFromPreset(cachedAnswers: CachedAnswers, preset: string): string {
    const { path, id } = this.getPathFromPreset(preset);
    const cache = cachedAnswers[id].value;

    if (this.utils.hasJsonStructure(cache)) {
      const date: string = UtilsService.getObjectProperty({ value: JSON.parse(cache) }, path, '');
      if (this.isShortTimeFormat(date)) {
        return date;
      } else {
        const parsedDate = this.datesToolsService.parseISO(date);
        return this.datesToolsService.format(parsedDate, DATE_STRING_DOT_FORMAT);
      }
    } else {
      if (this.isShortTimeFormat(cache)) {
        return cache;
      } else {
        const parsedDate = this.datesToolsService.parseISO(cache);
        return this.datesToolsService.format(parsedDate, DATE_STRING_DOT_FORMAT);
      }
    }
  }

  private getPresetsFromRawPresets(preset: string): Array<string> {
    return preset.split('||').map(ref => ref.trim());
  }

  private getPathFromPreset(value: string): { id: string; path: string } {
    const [id, path] = value.split(/\.(.+)/);
    return { id, path };
  }

  private isShortTimeFormat(date: string): boolean {
    return /^\d{1,2}.\d{1,2}.\d{1,4}$/.test(date);
  }

  private getComponentWithAttrsDateRef(component: ComponentDto, cachedAnswers: CachedAnswers): ComponentDto {
    const { attrs } = component;

    if(component.type === CustomScreenComponentTypes.DocInput) {
      const fields = attrs.fields as DocInputField[];
      const haveDateRef = ({ attrs }: DocInputField): boolean => Boolean(attrs?.minDateRef || attrs?.minDateRef);

      Object.values(fields).filter((field) => haveDateRef(field)).forEach(({ attrs }) => {
        this.setAttrsDateRef(attrs as ComponentAttrsDto, cachedAnswers);
      });
    }else {
      this.setAttrsDateRef(component.attrs, cachedAnswers);
    }
    return component;
  }


  private setAttrsDateRef(attrs: ComponentAttrsDto, cachedAnswers: CachedAnswers): void {
    if (attrs.minDateRef) {
      attrs.minDate = this.getLimitDate(cachedAnswers, attrs.minDateRef);
    }
    if (attrs.maxDateRef) {
      attrs.maxDate = this.getLimitDate(cachedAnswers, attrs.minDateRef);
    }
  }
}
