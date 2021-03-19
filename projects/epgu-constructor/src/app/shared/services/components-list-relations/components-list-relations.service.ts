import { Injectable } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { isUndefined } from '../../constants/uttils';
import {
  CustomComponent,
  CustomComponentRef,
  CustomComponentRefRelation,
  CustomListDictionaries,
  CustomListFormGroup,
  CustomListStatusElements,
  CustomStatusElement,
} from '../../components/components-list/components-list.types';
import { DateRangeService } from '../date-range/date-range.service';
import { DictionaryFilters, DictionarySubFilter } from '../dictionary/dictionary-api.types';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';
import { UtilsService as utils } from '../../../core/services/utils/utils.service';
import { ScreenService } from '../../../screen/screen.service';
import { RefRelationService } from '../ref-relation/ref-relation.service';
import { ComponentDictionaryFilters } from './components-list-relations.interface';
import { EMPTY_VALUE, NON_EMPTY_VALUE } from './components-list-relations.contant';
import { DateRangeRef } from '../date-range/date-range.models';

@Injectable()
export class ComponentsListRelationsService {
  public get filters(): ComponentDictionaryFilters {
    return this._filters$.getValue();
  }
  public set filters(val: ComponentDictionaryFilters) {
    this._filters$.next(val);
  }
  public get filters$(): Observable<ComponentDictionaryFilters> {
    return this._filters$.asObservable();
  }

  private prevValues: { [key: string]: string | number } = {};
  private readonly _filters$: BehaviorSubject<ComponentDictionaryFilters> = new BehaviorSubject({});

  constructor(
    private dateRangeService: DateRangeService,
    private refRelationService: RefRelationService,
  ) {}

  public getUpdatedShownElements(
    components: Array<CustomComponent>,
    component: CustomListFormGroup | CustomComponent,
    shownElements: CustomListStatusElements,
    form: FormArray,
    dictionaries: CustomListDictionaries,
    initInitialValues = false,
    screenService: ScreenService,
    dictionaryToolsService: DictionaryToolsService,
  ): CustomListStatusElements {
    this.getDependentComponents(components, <CustomComponent>component).forEach(
      (dependentComponent: CustomComponent) => {
        dependentComponent.attrs.ref
          ?.filter((el) => el.relatedRel === component.id)
          .forEach((reference) => {
            const value = reference.valueFromCache
              ? screenService.cachedAnswers[reference.valueFromCache].value
              : component.value;

            shownElements = this._getUpdatedShownElements(
              dependentComponent,
              reference,
              value as { [key: string]: string },
              components,
              form,
              shownElements,
              dictionaries,
              initInitialValues,
              dictionaryToolsService,
            );
          });

        this.updateReferenceLimitDate(dependentComponent, component, form, screenService);
      },
    );

    return shownElements;
  }

  public createStatusElements(
    components: Array<CustomComponent>,
  ): CustomListStatusElements {
    return components.reduce((acc, component: CustomComponent) => ({
      ...acc,
      [component.id]: {
        relation: CustomComponentRefRelation.displayOn,
        isShown: !this.hasRelation(component, CustomComponentRefRelation.displayOn),
      }
    }), {});
  }

  private updateReferenceLimitDate(
    dependentComponent: CustomComponent,
    component: CustomComponent | CustomListFormGroup,
    form: FormArray,
    screenService: ScreenService,
  ): void {
    const referenceDate = dependentComponent.attrs.ref?.find(
      (el: DateRangeRef) => el.relatedDate === component.id,
    );

    if (referenceDate) {
      this.dateRangeService.updateLimitDate(
        form,
        component as CustomComponent,
        dependentComponent,
        screenService.applicantAnswers,
      );
    }
  }

  private _getUpdatedShownElements(
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: { [key: string]: string }, // @todo. иногда здесь пустая строка вместо объекта
    components: Array<CustomComponent>,
    form: FormArray,
    shownElements: CustomListStatusElements,
    dictionaries: CustomListDictionaries,
    initInitialValues: boolean,
    dictionaryToolsService: DictionaryToolsService,
  ): CustomListStatusElements {
    const dependentControl: AbstractControl = form.controls.find(
      (control: AbstractControl) => control.value.id === dependentComponent.id,
    );
    const isDependentDisabled: boolean = dependentComponent.attrs.disabled;
    const element = shownElements[dependentComponent.id];

    switch (reference.relation) {
      case CustomComponentRefRelation.displayOff:
        this.handleIsDisplayOnRelation(
          element,
          shownElements,
          dependentComponent,
          reference,
          componentVal,
          dependentControl,
        );
        break;
      case CustomComponentRefRelation.displayOn:
        this.handleIsDisplayOffRelation(
          element,
          shownElements,
          dependentComponent,
          reference,
          componentVal,
          dependentControl,
        );
        break;
      case CustomComponentRefRelation.getValue:
        this.handleIsGetValueRelation(
          dependentComponent,
          reference,
          components,
          componentVal,
          form,
          dependentControl,
        );
        break;
      case CustomComponentRefRelation.autofillFromDictionary:
        this.handleIsAutofillFromDictionaryRelation(
          reference,
          components,
          componentVal,
          dictionaries,
          dependentControl,
          initInitialValues,
        );
        break;
      case CustomComponentRefRelation.calc:
        this.handleIsCalcRelation(
          dependentComponent,
          reference,
          components,
          form,
          dependentControl
        );
        break;
      case CustomComponentRefRelation.disabled:
        this.handleIsDisabledRelation(
          reference,
          componentVal,
          dependentControl,
          dependentComponent.id,

        );
        break;
      case CustomComponentRefRelation.filterOn:
        this.handleIsFilterOnRelation(
          reference,
          componentVal,
          dictionaryToolsService,
          dependentComponent,
        );
        break;
    }

    if (isDependentDisabled) {
      dependentControl.disable();
    }

    return shownElements;
  }

  private handleIsAutofillFromDictionaryRelation(
    reference: CustomComponentRef,
    components: CustomComponent[],
    componentVal: { [key: string]: string },
    dictionaries: CustomListDictionaries,
    dependentControl: AbstractControl,
    initInitialValues: boolean,
  ): void {
    /* NOTICE: тут происходит некая магия, которая разруливает конфликтный кейс автофила данных
      при первичной загрузке формы и ранее закешированных в cachedAnswers данных, а также
      отрабатывается кейс различающий первичную загрузку данных и нового пользовательского выбора */
    /* TODO: подумать над реалзиацией сервиса, директивы или отдельного модуля,
      который бы отвечал за работу с предазгруженными данными, в том числе с механизмом рефов.
      А в идеале передать всю эту историю на бэк */
    if (initInitialValues) {
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
  }

  private handleIsDisplayOffRelation(
    element: CustomStatusElement,
    shownElements: CustomListStatusElements,
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: { [key: string]: string },
    dependentControl: AbstractControl,
  ): void {
    const isDisplayOn = this.refRelationService.isDisplayOnRelation(element.relation);

    if ((isDisplayOn && element.isShown === true) || !isDisplayOn) {
      shownElements[dependentComponent.id] = {
        relation: CustomComponentRefRelation.displayOff,
        isShown: !this.isValueEquals(reference.val, componentVal),
      };
      dependentControl.markAsUntouched();
    }
  }

  private handleIsGetValueRelation(
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    components: CustomComponent[],
    componentVal: { [key: string]: string },
    form: FormArray,
    dependentControl: AbstractControl,
  ): void {
    const relation: CustomComponentRef = this.getRelation(dependentComponent, reference);
    const newValue = this.getValueFromRelationComponent(relation, components, componentVal, form);
    dependentControl.get('value').patchValue(newValue);
  }

  private handleIsCalcRelation(
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    components: CustomComponent[],
    form: FormArray,
    dependentControl: AbstractControl,
  ): void {
    const relation: CustomComponentRef = this.getRelation(dependentComponent, reference);
    const newValue = this.getCalcValueFromRelation(relation, components, form);
    dependentControl.get('value').patchValue(newValue);
  }

  private handleIsFilterOnRelation(
    reference: CustomComponentRef,
    componentVal: { [key: string]: string },
    dictionaryToolsService: DictionaryToolsService,
    dependentComponent: CustomComponent,
  ): void {
    if (
      this.isValueEquals(reference.val, componentVal) &&
      dictionaryToolsService.isDictionaryLike(dependentComponent.type)
    ) {
      this.applyFilter(dependentComponent.id, reference.filter, componentVal);
    } else {
      this.clearFilter(dependentComponent.id);
    }
  }

  private handleIsDisabledRelation(
    reference: CustomComponentRef,
    componentVal: { [key: string]: string },
    dependentControl: AbstractControl,
    dependentComponentId: string,
  ): void {
    const patchValueAndDisable = (
      control: AbstractControl,
      defaultValue?: string | boolean,
    ): void => {
      const valueControl: AbstractControl = control.get('value');
      this.prevValues[dependentComponentId] = valueControl.value;
      valueControl.patchValue(defaultValue || '');
      valueControl.markAsUntouched();
      control.disable({ onlySelf: true });
    };

    const patchToPrevValueAndEnable = (control: AbstractControl): void => {
      const isFindAndValue: boolean =
        !isUndefined(this.prevValues[dependentComponentId]) &&
        !!String(this.prevValues[dependentComponentId]);
      if (isFindAndValue) {
        control.get('value').patchValue(this.prevValues[dependentComponentId]);
      }

      control.enable({ onlySelf: true });
    };

    if (this.isValueEquals(reference.val, componentVal)) {
      patchValueAndDisable(dependentControl, reference.defaultValue);
    } else {
      patchToPrevValueAndEnable(dependentControl);
    }
  }

  private handleIsDisplayOnRelation(
    element: CustomStatusElement,
    shownElements: CustomListStatusElements,
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: { [key: string]: string },
    dependentControl: AbstractControl,
  ): void {
    const isDisplayOff = this.refRelationService.isDisplayOffRelation(element.relation);

    if ((isDisplayOff && element.isShown === true) || !isDisplayOff) {
      shownElements[dependentComponent.id] = {
        relation: CustomComponentRefRelation.displayOn,
        isShown: this.isValueEquals(reference.val, componentVal),
      };
      dependentControl.markAsUntouched();
    }
  }

  private hasRelation(component: CustomComponent, relation: CustomComponentRefRelation): boolean {
    return component.attrs.ref?.some((o) => o.relation === relation);
  }

  private isComponentDependent(arr = [], component: CustomComponent): boolean {
    return arr.some((el) => [el.relatedRel, el.relatedDate].includes(component.id));
  }

  private getDependentComponents(
    components: CustomComponent[],
    component: CustomComponent,
  ): Array<CustomComponent> {
    return components.filter((_component: CustomComponent) =>
      this.isComponentDependent(_component.attrs.ref, component),
    );
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

  private getRelation(
    component: CustomComponent,
    reference: CustomComponentRef,
  ): CustomComponentRef {
    return component.attrs.ref?.find(({ relation }) => relation === reference.relation);
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
  private getCalcValueFromRelation(
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
      const targetFormKey = `${components.findIndex((component) => component.id === k)}.value`;
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
   * Возвращает вычисленное значение по формуле
   * @param formula - формула для расчета
   */
  private getCalcFieldValue(formula: string): number {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func
    return Function(`'use strict'; return (Math.round(${formula}))`)();
  }

  private getValueFromComponentVal(componentVal: { id?: string } | string): string {
    return ['string', 'boolean'].includes(typeof componentVal)
      ? (componentVal as string)
      : (componentVal as { id?: string })?.id;
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
    dependentComponentId: CustomComponent['id'],
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

    this.filters = { [dependentComponentId]: filter };
  }

  private clearFilter(dependentComponentId: CustomComponent['id']): void {
    if (this.filters[dependentComponentId]) {
      this.filters = { [dependentComponentId]: null };
    }
  }
}
