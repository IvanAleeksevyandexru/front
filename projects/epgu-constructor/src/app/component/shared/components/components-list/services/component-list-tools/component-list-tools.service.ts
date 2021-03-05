import { Injectable } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { isUndefined, toBoolean } from '../../../../../../shared/constants/uttils';
import {
  CustomComponent,
  CustomComponentDropDownItem,
  CustomComponentDropDownItemList,
  CustomComponentRef,
  CustomComponentRefRelation,
  CustomListDictionaries,
  CustomListFormGroup,
  CustomListStatusElements,
  CustomScreenComponentTypes,
  CustomScreenComponentValueTypes,
} from '../../components-list.types';
import { ListItem } from 'epgu-lib';
import { UtilsService as utils } from '../../../../../../core/services/utils/utils.service';
import { DateRangeService } from '../date-range/date-range.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import {
  DictionaryFilters,
  DictionarySubFilter,
} from '../../../../services/dictionary-api/dictionary-api.types';
import { likeDictionary } from '../../tools/custom-screen-tools';

const EMPTY_VALUE = '';
const NON_EMPTY_VALUE = '*';

export interface ComponentDictionaryFilters {
  [key: string]: DictionaryFilters['filter'] | null;
}

@Injectable()
export class ComponentListToolsService {
  private readonly availableComponentTypesToJsonParse = [
    CustomScreenComponentTypes.DropDown,
    CustomScreenComponentTypes.Lookup,
    CustomScreenComponentTypes.Dictionary,
    CustomScreenComponentTypes.AddressInput,
    CustomScreenComponentTypes.CityInput,
    CustomScreenComponentTypes.PassportLookup,
    CustomScreenComponentTypes.DocInput,
  ];

  private prevValues: { [key: string]: string | number } = {};
  private readonly _filters$: BehaviorSubject<ComponentDictionaryFilters> = new BehaviorSubject({});

  constructor(private dateRangeService: DateRangeService, private screenService: ScreenService) {}

  updateStatusElements(
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: { [key: string]: string }, // @todo. иногда здесь пустая строка вместо объекта
    components: Array<CustomComponent>,
    form: FormArray,
    shownElements: CustomListStatusElements,
    dictionaries: CustomListDictionaries,
    initInitialValues: boolean,
  ): CustomListStatusElements {
    const dependentControl: AbstractControl = form.controls.find(
      (control: AbstractControl) => control.value.id === dependentComponent.id,
    );
    const patchValueAndDisable = (
      control: AbstractControl,
      defaultValue?: string | boolean,
    ): void => {
      const valueControl: AbstractControl = control.get('value');
      this.prevValues[dependentComponent.id] = valueControl.value;
      valueControl.patchValue(defaultValue || '');
      valueControl.markAsUntouched();
      control.disable({ onlySelf: true });
    };
    const patchToPrevValueAndEnable = (control: AbstractControl): void => {
      const isFindAndValue: boolean =
        !isUndefined(this.prevValues[dependentComponent.id]) &&
        !!String(this.prevValues[dependentComponent.id]);
      if (isFindAndValue) {
        control.get('value').patchValue(this.prevValues[dependentComponent.id]);
      }

      control.enable({ onlySelf: true });
    };
    const isDependentDisabled: boolean = dependentComponent.attrs?.disabled;
    const element = shownElements[dependentComponent.id];

    if (reference.relation === CustomComponentRefRelation.displayOn) {
      const isDisplayOff = element.relation === CustomComponentRefRelation.displayOff;

      if ((isDisplayOff && element.isShown === true) || !isDisplayOff) {
        shownElements[dependentComponent.id] = {
          relation: CustomComponentRefRelation.displayOn,
          isShown: this.isValueEquals(reference.val, componentVal),
        };
        dependentControl.markAsUntouched();
      }
    }

    if (reference.relation === CustomComponentRefRelation.disabled) {
      if (this.isValueEquals(reference.val, componentVal)) {
        patchValueAndDisable(dependentControl, reference.defaultValue);
      } else {
        patchToPrevValueAndEnable(dependentControl);
      }
    }

    if (reference.relation === CustomComponentRefRelation.filterOn) {
      if (
        this.isValueEquals(reference.val, componentVal) &&
        likeDictionary(dependentComponent.type)
      ) {
        this.applyFilter(dependentComponent, reference.filter, componentVal);
      } else {
        this.clearFilter(dependentComponent);
      }
    }

    if (reference.relation === CustomComponentRefRelation.calc) {
      const relation: CustomComponentRef = this.getRelation(dependentComponent ,reference);
      const newValue = this.calculateValueFromRelation(relation, components, form);
      dependentControl.get('value').patchValue(newValue);
    }

    if (reference.relation === CustomComponentRefRelation.getValue) {
      const relation: CustomComponentRef = this.getRelation(dependentComponent ,reference);
      const newValue = this.getValueFromRelationComponent(relation, components, componentVal, form);
      dependentControl.get('value').patchValue(newValue);
    }

    if (reference.relation === CustomComponentRefRelation.displayOff) {
      const isDisplayOn = element.relation === CustomComponentRefRelation.displayOn;

      if ((isDisplayOn && element.isShown === true) || !isDisplayOn) {
        shownElements[dependentComponent.id] = {
          relation: CustomComponentRefRelation.displayOff,
          isShown: !this.isValueEquals(reference.val, componentVal),
        };
        dependentControl.markAsUntouched();
      }
    }

    /* NOTICE: ниже происходит некая магия, которая разруливает конфликтный кейс автофила данных
      при первичной загрузке формы и ранее закешированных в cachedAnswers данных, а также
      отрабатывается кейс различающий первичную загрузку данных и нового пользовательского выбора */
    /* TODO: подумать над реалзиацией сервиса, директивы или отдельного модуля,
      который бы отвечал за работу с предазгруженными данными, в том числе с механизмом рефов.
      А в идеале передать всю эту историю на бэк */
    if (
      reference.relation === CustomComponentRefRelation.autofillFromDictionary &&
      initInitialValues
    ) {
      const attributeName = reference.val as string;
      const componentId = reference.relatedRel;
      const dictionaryAttributeValue = this.getDictionaryAttributeValue(
        attributeName,
        componentId,
        components,
        componentVal,
        dictionaries,
      );

      if (dictionaryAttributeValue === undefined) {
        dependentControl.get('value').patchValue('');
      } else {
        dependentControl
          .get('value')
          .patchValue(
            dependentControl.value.value !== ''
              ? dependentControl.value.value
              : dictionaryAttributeValue,
          );
      }

      dependentControl.markAsUntouched();
    }

    if (isDependentDisabled) {
      dependentControl.disable();
    }

    return shownElements;
  }

  hasRelation(component: CustomComponent, relation: CustomComponentRefRelation): boolean {
    return component.attrs?.ref?.some((o) => o.relation === relation);
  }

  updateDependents(
    components: Array<CustomComponent>,
    component: CustomListFormGroup | CustomComponent,
    shownElements: CustomListStatusElements,
    form: FormArray,
    dictionaries: CustomListDictionaries,
    initInitialValues = false,
  ): CustomListStatusElements {
    const isComponentDependent = (arr = []): boolean =>
      arr?.some((el) => [el.relatedRel, el.relatedDate].includes(component.id));

    const getDependentComponents = (components): Array<CustomComponent> =>
      components.filter((c: CustomComponent) => isComponentDependent(c.attrs?.ref));

    getDependentComponents(components).forEach((dependentComponent: CustomComponent) => {
      dependentComponent.attrs?.ref
        ?.filter((el) => el.relatedRel === component.id)
        .forEach((reference) => {
          const value = reference.valueFromCache
            ? this.screenService.cachedAnswers[reference.valueFromCache].value
            : component.value;

          shownElements = this.updateStatusElements(
            dependentComponent,
            reference,
            value as { [key: string]: string },
            components,
            form,
            shownElements,
            dictionaries,
            initInitialValues,
          );
        });

      const referenceDate = dependentComponent.attrs?.ref?.find(
        (el) => el.relatedDate === component.id,
      );

      if (referenceDate) {
        this.updateLimitDate(form, component as CustomComponent, dependentComponent);
      }
    });

    return shownElements;
  }

  createStatusElements(
    components: Array<CustomComponent>,
    shownElements: CustomListStatusElements,
  ): CustomListStatusElements {
    components.forEach((component: CustomComponent) => {
      shownElements[component.id] = {
        relation: CustomComponentRefRelation.displayOn,
        isShown: !this.hasRelation(component, CustomComponentRefRelation.displayOn),
      };
    });

    return shownElements;
  }

  convertedValue(component: CustomComponent): CustomScreenComponentValueTypes {
    const isDateAndValue: boolean = this.isDate(component.type) && !!component.value;
    const parseValue = (value): CustomScreenComponentValueTypes => {
      if (isDateAndValue) {
        return new Date(value);
      } else if (this.isAddress(component.type)) {
        try {
          return JSON.parse(value).fullAddress;
        } catch (e) {
          return value;
        }
      } else if (this.isJson(component.type)) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      } else if (this.isCheckBox(component.type)) {
        return toBoolean(value);
      } else {
        return value;
      }
    };

    if (typeof component.value === 'string' && component.value.length) {
      return parseValue(component.value);
    } else if (!isUndefined(component.attrs?.defaultValue)) {
      return parseValue(component.attrs?.defaultValue);
    } else {
      return component.value;
    }
  }

  loadCycledDropdown(itemComponent: CustomComponent): Partial<ListItem>[] {
    if (!itemComponent?.attrs?.add) {
      return [];
    }

    const { component, caption } = itemComponent?.attrs?.add;
    const answers = this.screenService.cachedAnswers;
    const items = answers[component];
    if (!items) {
      return [];
    }
    let result:
      | string
      | Array<Record<string, string | boolean | number>>
      | Record<string, string | boolean | number>;
    try {
      result = JSON.parse(items.value);
    } catch (e) {
      return [];
    }
    if (!Array.isArray(result)) {
      return [];
    }
    return (result as Array<Record<string, string | boolean | number>>).map((answer) => {
      const text = caption
        .reduce((acc, value) => {
          acc.push(answer[value]);
          return acc;
        }, [])
        .join(' ');
      return {
        text,
        id: JSON.stringify(answer),
        originalItem: answer,
      };
    });
  }

  adaptiveDropDown(items: CustomComponentDropDownItemList): Partial<ListItem>[] {
    return items.map((item: CustomComponentDropDownItem, index: number) => {
      const itemText = item.label || item.title;
      const itemCode = item.code || item?.value || `${itemText}-${index}`;
      return {
        id: itemCode,
        text: itemText,
        unselectable: !!item.disable,
        originalItem: item,
        compare: (): boolean => false,
      };
    });
  }

  isAddress(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.AddressInput;
  }

  isJson(type: CustomScreenComponentTypes): boolean {
    return this.availableComponentTypesToJsonParse.includes(type);
  }

  isCheckBox(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.CheckBox;
  }

  isDate(type: CustomScreenComponentTypes): boolean {
    return type === CustomScreenComponentTypes.DateInput;
  }

  public get filters(): ComponentDictionaryFilters {
    return this._filters$.getValue();
  }
  public set filters(val: ComponentDictionaryFilters) {
    this._filters$.next(val);
  }
  public get filters$(): Observable<ComponentDictionaryFilters> {
    return this._filters$.asObservable();
  }

  private getRelation(component: CustomComponent, reference: CustomComponentRef): CustomComponentRef {
    return component.attrs?.ref?.find(({ relation }) => relation === reference.relation);
  }

  /**
   * Возвращает значение атрибута attributeName из словаря компонента componentId.
   * Если атрибут не найден, то возвращается undefined.
   *
   * @param dictionaryAttributeName - название атрибута из словаря
   * @param componentId - ID компонента
   * @param components - компоненты с информацией
   */
  private getDictionaryAttributeValue(
    dictionaryAttributeName: string,
    componentId: string,
    components: CustomComponent[],
    componentVal: { [key: string]: string } | '', // @todo. проверить, правильно ли указан тип
    dictionaries: CustomListDictionaries,
  ): unknown {
    const relatedComponent = components.find((item) => item.id === componentId);

    if (relatedComponent) {
      const dictKey = utils.getDictKeyByComp(relatedComponent);

      const dictionary = dictionaries[dictKey];

      if (dictionary) {
        if (componentVal) {
          const dictionaryItem = dictionary.list.find((item) => item.id === componentVal.id);

          return dictionaryItem.originalItem.attributeValues[dictionaryAttributeName];
        }
      }
    }

    return undefined;
  }

  /**
   * Возвращает значение из другого компанента
   * @param itemRef - объект с информацией о связи
   * @param components - компоненты с информацией
   * @param componentVal - значение компаненты
   * @param form - ссылка на объект формы
   */
  private getValueFromRelationComponent(
    itemRef: CustomComponentRef,
    components: CustomComponent[],
    componentVal: { [key: string]: string } | '',
    form: FormArray,
  ): number | string | undefined {
    const conditionValue = itemRef.val;
    if (componentVal === conditionValue) {
      const sourceComponentIndex = components.findIndex(({ id }) => id === itemRef.sourceId);
      const control = form.get(sourceComponentIndex.toString());
      return control?.value?.value ?? control?.value;
    }
  }

  /**
   * Подсчитывает автовычисляемое значение из формулы, которую передали
   * @param itemRef - объект с информацией о связи
   * @param components - компоненты с информацией
   * @param form - ссылка на объект формы
   * @example {val: '{add16} + {add17} / 100'} => 50 + 150 / 100
   */
  private calculateValueFromRelation(
    itemRef: CustomComponentRef,
    components: CustomComponent[],
    form: FormArray,
  ): number | string {
    let str = itemRef.val as string;
    const lettersAnNumberItemRegExp = /\{\w+\}/gm;
    const matches = str.match(lettersAnNumberItemRegExp);
    const componentKeys = Array.isArray(matches) ? [...matches] : [];

    let haveAllValues = true;
    componentKeys.forEach((key: string) => {
      const k = key.replace('{', '').replace('}', '');
      const targetFormKey = `${components.findIndex((c) => c.id === k)}.value`;
      const control = form.get(targetFormKey);
      const val = Number(control?.value);
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(val)) {
        haveAllValues = false;
      } else {
        str = str.replace(key, val.toString());
      }
    });

    // Возвращает например Math.round({add16} + {add17} / 100) => Math.round(50 + 150 / 100)
    return haveAllValues ? this.getCalcFieldValue(str) : '';
  }

  /**
   * Возвращает вычисленное значение по формуле по формуле
   * @param formula - формула для расчета
   */
  private getCalcFieldValue(formula: string): number {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func
    return Function(`'use strict'; return (Math.round(${formula}))`)();
  }

  private getValueFromComponentVal(componentVal: { id?: string } | string): string {
    return (['string', 'boolean'].includes(typeof componentVal)
      ? (componentVal as string)
      : (componentVal as { id?: string })?.id);
  }

  /**
   * Сравнивает значание в зависимости от типа
   * @param value - value из зависимого компонета
   * @param componentVal - value из компонета
   */
  private isValueEquals(
    value: string | Array<string> | boolean,
    componentVal: { id?: string },
  ): boolean {
    const componentValue = this.getValueFromComponentVal(componentVal);

    if (value === EMPTY_VALUE) {
      return !componentValue;
    }

    if (value === NON_EMPTY_VALUE) {
      return !!componentValue;
    }

    if (Array.isArray(value)) {
      return value.some((values) => values === componentValue);
    }

    return value === componentValue;
  }

  private applyFilter(
    dependentComponent: CustomComponent,
    filter: DictionaryFilters['filter'],
    componentVal: { id?: string },
  ): void {
    const value = this.getValueFromComponentVal(componentVal);

    if (filter.simple) {
      filter.simple.value.asString = value;
    } else if (filter.union) {
      filter.union.subs = filter.union.subs.map(
        (subFilter: DictionarySubFilter): DictionarySubFilter => {
          subFilter.simple.value.asString = value;

          return subFilter;
        },
      );
    }

    this.filters = { [dependentComponent.id]: filter };
  }

  private clearFilter(dependentComponent: CustomComponent): void {
    if (this.filters[dependentComponent.id]) {
      this.filters = { [dependentComponent.id]: null };
    }
  }

  private async updateLimitDate(
    form: FormArray,
    component: CustomComponent,
    dependentComponent: CustomComponent,
  ): Promise<void> {
    const dependentControl = form.controls.find(
      (control) => control.value.id === dependentComponent.id,
    );

    if (dependentControl) {
      const relatedDate = component.value !== '' ? new Date(component.value) : null;
      const { attrs, id, value } = dependentControl.value;
      const minDate = await this.dateRangeService.getMinDate(attrs.ref, id, relatedDate);
      const maxDate = await this.dateRangeService.getMaxDate(attrs.ref, id, relatedDate);
      this.dateRangeService.changeDate(attrs.ref, relatedDate);

      dependentControl.get('attrs').patchValue({
        ...attrs,
        minDate: minDate || attrs.minDate,
        maxDate: maxDate || attrs.maxDate,
      });

      const isDateInRange = value >= minDate?.getTime() && value <= maxDate?.getTime();
      if (!isDateInRange) {
        dependentControl.get('value').patchValue('');
      }
    }
  }
}
