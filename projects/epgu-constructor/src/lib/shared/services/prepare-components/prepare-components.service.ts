import { Injectable } from '@angular/core';
import { CachedAnswersService } from '../cached-answers/cached-answers.service';
import { CachedAnswers, ScreenStoreComponentDtoI } from '../../../screen/screen.types';
import {
  CustomComponentRef,
  CustomScreenComponentTypes,
} from '../../../component/custom-screen/components-list.types';
import { UtilsService } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { DATE_STRING_DOT_FORMAT } from '@epgu/epgu-constructor-ui-kit';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import { DocInputField } from '../../../component/custom-screen/components/doc-input/doc-input.types';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';
import { RefRelationService } from '../ref-relation/ref-relation.service';
import { ComponentDto, ComponentAttrsDto, DictionaryFilters } from '@epgu/epgu-constructor-types';

@Injectable()
export class PrepareComponentsService {
  constructor(
    private cachedAnswersService: CachedAnswersService,
    private datesToolsService: DatesToolsService,
    private dictionaryToolsService: DictionaryToolsService,
    private refRelationService: RefRelationService,
  ) {}

  public prepareComponents(
    components: Array<ComponentDto>,
    cachedAnswers: CachedAnswers,
  ): Array<ScreenStoreComponentDtoI> {
    let preparedComponents;
    preparedComponents = this.loadValueFromCachedAnswer(components, cachedAnswers);
    preparedComponents = this.handleRelatedRelComponents(preparedComponents, cachedAnswers);
    return preparedComponents;
  }

  private loadValueFromCachedAnswer(
    components: Array<ComponentDto>,
    cachedAnswers: CachedAnswers,
  ): Array<ScreenStoreComponentDtoI> {
    return components.map((component) => {
      component.valueFromCache = false;
      if (component.type === UniqueScreenComponentTypes.repeatableFields) {
        const components = component.attrs.components.map((component) =>
          this.getComponentWithAttrsDateRef(component, cachedAnswers),
        );

        const repeatableFieldsComponents = this.setRepeatableFields(
          components,
          cachedAnswers,
          component,
        );

        component.attrs.repeatableComponents = [
          ...(component.attrs.repeatableComponents || []),
          ...repeatableFieldsComponents,
        ];

        return component;
      }

      const hasPresetTypeRef = component.attrs?.preset?.type === 'REF';
      const cachedValue = this.getCache(component, cachedAnswers);

      if (hasPresetTypeRef && !cachedValue) {
        return this.getPresetValue(
          this.getComponentWithAttrsDateRef(component, cachedAnswers),
          cachedAnswers,
        );
      }

      return this.getComponentWithCaches(
        this.getComponentWithAttrsDateRef(component, cachedAnswers),
        cachedValue,
      );
    });
  }

  private setRepeatableFields(
    components: Array<ComponentDto>,
    cachedAnswers: CachedAnswers,
    parentComponent: ComponentDto,
  ): Array<Array<ComponentDto>> {
    const cachedValue =
      this.getCache(parentComponent, cachedAnswers) ||
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
      let parsedJson = JSON.parse(cachedValue);
      return parentIndex && parentId ? parsedJson[parentIndex][parentId].snils: parsedJson.snils;
    }

    const isPresetParsable = UtilsService.hasJsonStructure(preset);
    const isCachedValueParsable = UtilsService.hasJsonStructure(cachedValue);

    if (isPresetParsable && isCachedValueParsable) {
      const parsedPreset = JSON.parse(preset);
      let parsedCachedValue = this.cachedAnswersService.parseCachedValue(cachedValue, component);
      if (parentId) {
        parsedCachedValue = parsedCachedValue[parentIndex][parentId];
      }

      if (Array.isArray(parsedCachedValue)) {
        return JSON.stringify(parsedCachedValue);
      } else {
        return JSON.stringify({
          ...parsedPreset,
          ...(parsedCachedValue as object),
        });
      }
    }

    if (parentId && isCachedValueParsable) {
      const value = this.cachedAnswersService.parseCachedValue(cachedValue, component);

      return value[parentIndex] && value[parentIndex][parentId];
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

  private getCache(component: ComponentDto, cachedAnswers: CachedAnswers): string | null {
    const { id, type, attrs } = component;
    const shouldBeTakenFromTheCache = this.cachedAnswersService.shouldBeTakenFromTheCache(type); // TODO костыль от backend(-a);

    if (shouldBeTakenFromTheCache) {
      if (type === 'RepeatableFields' && attrs.cacheRepeatableFieldsAnswersLocally) {
          return (
            this.cachedAnswersService.getCachedValueFromLocalStorage(id) ||
            this.cachedAnswersService.getCachedValueById(cachedAnswers, id)
          );
      }
      return this.cachedAnswersService.getCachedValueById(cachedAnswers, id);
    }
    return null;
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
        value: this.mergePresetCacheValue(cachedValue, component, parentId, parentIndex),
        valueFromCache: true,
      };
    }

    return component;
  }

  private getLimitDate(cachedAnswers: CachedAnswers, rawPresets: string): string {
    const presets = this.getPresetsFromRawPresets(rawPresets);
    for (let i = 0; i < presets.length; i++) {
      const result = this.getLimitDateFromPreset(cachedAnswers, presets[i]);

      if (result) {
        return result;
      }
    }

    return null;
  }

  private getLimitDateFromPreset(cachedAnswers: CachedAnswers, preset: string): string {
    const { path, id } = this.getPathFromPreset(preset);
    const cache = cachedAnswers[id].value;

    if (UtilsService.hasJsonStructure(cache)) {
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
    return preset.split('||').map((ref) => ref.trim());
  }

  private getPathFromPreset(value: string): { id: string; path: string } {
    const [id, path] = value.split(/\.(.+)/);
    return { id, path };
  }

  private isShortTimeFormat(date: string): boolean {
    return /^\d{1,2}.\d{1,2}.\d{1,4}$/.test(date);
  }

  private getComponentWithAttrsDateRef(
    component: ComponentDto,
    cachedAnswers: CachedAnswers,
  ): ComponentDto {
    const { attrs } = component;

    if (
      component.type === CustomScreenComponentTypes.DocInput ||
      component.type === UniqueScreenComponentTypes.registrationAddr
    ) {
      const fields = attrs.fields as DocInputField[];
      const haveDateRef = ({ attrs }: DocInputField): boolean =>
        Boolean(attrs?.minDateRef || attrs?.maxDateRef);

      Object.values(fields)
        .filter((field) => haveDateRef(field))
        .forEach(({ attrs }) => {
          this.setAttrsDateRef(attrs as ComponentAttrsDto, cachedAnswers);
        });
    } else if (
      this.dictionaryToolsService.isDictionaryLike(component.type as CustomScreenComponentTypes)
    ) {
      component.attrs = this.setAttrsFilters(component.attrs, cachedAnswers);
    } else {
      this.setAttrsDateRef(component.attrs, cachedAnswers);
    }
    return component;
  }

  private extractDateRef(refDate: string): string[] {
    const ref = refDate.match(/^[\.\w]{0,}/gim)[0];
    return [ref, refDate.replace(ref, '')];
  }

  private setAttrsDateRef(attrs: ComponentAttrsDto, cachedAnswers: CachedAnswers): void {
    if (attrs.minDateRef) {
      const extract = this.extractDateRef(attrs.minDateRef);

      attrs.minDate = this.getLimitDate(cachedAnswers, extract[0]) + extract[1];
    }
    if (attrs.maxDateRef) {
      const extract = this.extractDateRef(attrs.maxDateRef);
      attrs.maxDate = this.getLimitDate(cachedAnswers, extract[0]) + extract[1];
    }
  }

  private setAttrsFilters(
    attrs: ComponentAttrsDto,
    cachedAnswers: CachedAnswers,
  ): ComponentAttrsDto {
    if (!attrs.refs || typeof attrs.refs !== 'object') {
      return attrs;
    }

    return Object.keys(attrs.refs).reduce((resultAttrs: ComponentAttrsDto, key: string) => {
      return this.getPresetsFromRawPresets(resultAttrs.refs[key]).reduce(
        (attrsWithFilter: ComponentAttrsDto, preset) => {
          const { path, id } = this.getPathFromPreset(preset);
          const cache = cachedAnswers[id].value;

          if (!UtilsService.hasJsonStructure(cache)) {
            return attrsWithFilter;
          }

          const value: string = UtilsService.getObjectProperty(
            { value: JSON.parse(cache) },
            path,
            '',
          );

          return this.putValueToFilters(key, value, attrsWithFilter);
        },
        resultAttrs,
      );
    }, attrs);
  }

  private putValueToFilters(
    key: string,
    value: string,
    attrs: ComponentAttrsDto,
  ): ComponentAttrsDto {
    const filter = attrs?.dictionaryOptions?.filter as DictionaryFilters['filter'];
    if (filter?.simple?.value?.asString) {
      const valueRef = filter.simple.value;

      valueRef.asString = (valueRef.asString as string).replace(`\${${key}}`, value);
    } else if (filter?.union?.subs) {
      const subs = filter.union.subs;

      filter.union.subs = subs.map((subFilter) => {
        (subFilter.simple.value.asString as string).replace(`\${${key}}`, value);

        return subFilter;
      });
    }

    return attrs;
  }

  private handleRelatedRelComponents(
    components: Array<ComponentDto>,
    cachedAnswers: CachedAnswers,
  ): Array<ScreenStoreComponentDtoI> {
    return components.map((component) => {
      const ref = component.attrs?.ref;
      if (ref && Array.isArray(ref)) {
        return this.handleCustomComponentRef(
          component,
          ref as CustomComponentRef[],
          components,
          cachedAnswers,
        );
      }
      return component;
    });
  }

  private handleCustomComponentRef(
    component: ComponentDto,
    refs: CustomComponentRef[],
    components: Array<ComponentDto>,
    cachedAnswers: CachedAnswers,
  ): ScreenStoreComponentDtoI {
    refs.forEach((ref) => {
      const isPrevScreenRelation =
        components.filter((item) => item.id === ref.relatedRel).length === 0;

      if (isPrevScreenRelation) {
        const cachedValue = this.cachedAnswersService.getCachedValueById(
          cachedAnswers,
          ref.relatedRel,
        );

        if (this.refRelationService.isDisplayOffRelation(ref.relation)) {
          this.handleDisplayOff(component, ref, cachedValue);
        } else if (this.refRelationService.isDisplayOnRelation(ref.relation)) {
          this.handleDisplayOn(component, ref, cachedValue);
        }
      }
    });

    return component;
  }

  private handleDisplayOff(
    component: ComponentDto,
    ref: CustomComponentRef,
    cachedValue: string,
  ): void {
    component.attrs.hidden = this.refRelationService.isValueEquals(ref.val, cachedValue);
  }

  private handleDisplayOn(
    component: ComponentDto,
    ref: CustomComponentRef,
    cachedValue: string,
  ): void {
    component.attrs.hidden = !this.refRelationService.isValueEquals(ref.val, cachedValue);
  }
}
