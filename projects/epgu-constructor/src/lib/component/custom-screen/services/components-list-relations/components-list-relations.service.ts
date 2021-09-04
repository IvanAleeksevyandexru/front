import { Injectable } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { get, isUndefined, isEmpty } from 'lodash';
import {
  CustomComponent,
  CustomComponentRef,
  CustomListDictionaries,
  CustomListFormGroup,
  CustomListStatusElements,
  CustomStatusElement,
  DATE_RESTRICTION_GROUP_DEFAULT_KEY,
  DateRestriction,
  DateRestrictionGroups,
} from '../../components-list.types';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ScreenService } from '../../../../screen/screen.service';
import { RefRelationService } from '../../../../shared/services/ref-relation/ref-relation.service';
import { ComponentDictionaryFilters, ComponentRestUpdates, ComponentValueChangeDto } from './components-list-relations.interface';
import { DateRangeRef, Range } from '../../../../shared/services/date-range/date-range.models';
import { CachedAnswers } from '../../../../screen/screen.types';
import {
  ApplicantAnswersDto,
  CustomComponentRefRelation,
  DictionaryFilters,
} from '@epgu/epgu-constructor-types';
import { DateRestrictionsService } from '../../../../shared/services/date-restrictions/date-restrictions.service';
import { getDictKeyByComp } from '../../../../shared/services/dictionary/dictionary-helper';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';
import { RestToolsService } from '../../../../shared/services/rest-tools/rest-tools.service';
import { DateRefService } from '../../../../core/services/date-ref/date-ref.service';

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

  public get restUpdates(): ComponentRestUpdates {
    return this._restUpdates$.getValue();
  }

  public set restUpdates(val: ComponentRestUpdates) {
    this._restUpdates$.next(val);
  }

  public get restUpdates$(): Observable<ComponentRestUpdates> {
    return this._restUpdates$.asObservable();
  }

  private prevValues: { [key: string]: string | number } = {};
  private readonly _filters$: BehaviorSubject<ComponentDictionaryFilters> = new BehaviorSubject({});
  private readonly _restUpdates$: BehaviorSubject<ComponentRestUpdates> = new BehaviorSubject({});

  constructor(
    private dateRangeService: DateRangeService,
    private refRelationService: RefRelationService,
    private dateRestrictionsService: DateRestrictionsService,
    private jsonHelperService: JsonHelperService,
    private dateRefService: DateRefService
  ) {}

  public getUpdatedShownElements(
    components: CustomComponent[],
    component: CustomListFormGroup | CustomComponent,
    shownElements: CustomListStatusElements,
    form: FormArray,
    dictionaries: CustomListDictionaries,
    initInitialValues = false,
    screenService: ScreenService,
    dictionaryToolsService: DictionaryToolsService,
    componentsGroupIndex?: number,
  ): CustomListStatusElements {
    this.getDependentComponents(components, <CustomComponent>component).forEach(
      (dependentComponent: CustomComponent) => {
        dependentComponent.attrs.ref
          ?.filter((el) => (el.relatedRel ? el.relatedRel.split(';') : []).some((e) => e === component.id))
          .forEach((reference) => {
            const value = reference.valueFromCache
              ? screenService.cachedAnswers[reference.valueFromCache].value
              : component.value ?? component.valueFromCache;

            shownElements = this.getDependentComponentUpdatedShownElements(
              dependentComponent,
              reference,
              value as { [key: string]: string },
              components,
              form,
              shownElements,
              dictionaries,
              initInitialValues,
              dictionaryToolsService,
              screenService,
            );
          });

        this.updateReferenceLimitDate(dependentComponent, component, form, screenService);
      },
    );

    this.updateLimitDatesByDateRestrictions(
      components,
      component,
      form,
      screenService.applicantAnswers,
      initInitialValues,
      componentsGroupIndex,
    );

    return shownElements;
  }

  async updateLimitDatesByDateRestrictions(
    components: CustomComponent[],
    component: CustomComponent | CustomListFormGroup,
    form: FormArray,
    applicantAnswers: ApplicantAnswersDto,
    initInitialValues: boolean,
    componentsGroupIndex?: number
  ): Promise<void> {
    if (component.attrs.dateRestrictions && !initInitialValues) {
      await this.setLimitDates(component, components, form, applicantAnswers, componentsGroupIndex);
      return;
    }

    if (initInitialValues) {
      await this.updateLimitDates(component, components, form, applicantAnswers, componentsGroupIndex);
    }
  }

  public createStatusElements(
    components: CustomComponent[],
    cachedAnswers: CachedAnswers,
  ): CustomListStatusElements {
    return components.reduce(
      (acc, component: CustomComponent) => ({
        ...acc,
        [component.id]: {
          relation: CustomComponentRefRelation.displayOn,
          isShown: !this.hasRelation(component, cachedAnswers),
        },
      }),
      {},
    );
  }

  /**
   * Подсчитывает автовычисляемое значение из формулы, которую передали
   * @param itemRef - объект с информацией о связи
   * @param components - компоненты с информацией
   * @param form - ссылка на объект формы
   * @example {val: '{add16} + {add17} / 100'} => 50 + 150 / 100
   */
  public getCalcValueFromRelation(
    itemRef: CustomComponentRef,
    components: CustomComponent[],
    form: FormArray,
  ): string {
    let str = itemRef.val as string;
    const lettersAnNumberItemRegExp = /\{\w+\}/gm;
    const matches = str.match(lettersAnNumberItemRegExp);
    const componentKeys = Array.isArray(matches) ? [...matches] : [];

    let haveAllValues = true;
    componentKeys.forEach((key: string) => {
      const k = key.replace('{', '').replace('}', '');
      const targetFormKey = `${components.findIndex((component) => component.id === k)}.value`;
      const control = form.get(targetFormKey);
      const val = parseFloat(control?.value.replace(/ /g, '').replace(',', '.'));
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(val)) {
        haveAllValues = false;
      } else {
        str = str.replace(key, val.toString());
      }
    });

    // Возвращает например ({add16} + {add17} / 100) => (50 + 150 / 100)
    return haveAllValues ? this.getCalcFieldValue(str).toString() : '';
  }

  public applyFilter(
    dependentComponentId: CustomComponent['id'],
    filter: DictionaryFilters['filter'],
  ): void {
    this.filters = { [dependentComponentId]: filter };
  }

  public clearFilter(dependentComponentId: CustomComponent['id']): void {
    if (this.filters[dependentComponentId]) {
      this.filters = { [dependentComponentId]: null };
    }
  }

  public hasRelation(component: CustomComponent, cachedAnswers: CachedAnswers): boolean {
    const refs = component.attrs?.ref;
    const displayOff = refs?.find((o) => this.refRelationService.isDisplayOffRelation(o.relation));
    const displayOn = refs?.find((o) => this.refRelationService.isDisplayOnRelation(o.relation));

    if (displayOff && cachedAnswers && cachedAnswers[displayOff?.relatedRel]) {
      return this.refRelationService.isValueEquals(
        displayOff.val,
        get(this.getRefValue(cachedAnswers[displayOff.relatedRel].value), displayOff.path) ||
          cachedAnswers[displayOff.relatedRel].value,
      );
    } else if (displayOn && cachedAnswers && cachedAnswers[displayOn?.relatedRel]) {
      return !this.refRelationService.isValueEquals(
        displayOn.val,
        get(this.getRefValue(cachedAnswers[displayOn.relatedRel].value), displayOn.path) ||
          cachedAnswers[displayOn.relatedRel].value,
      );
    } else {
      return false;
    }
  }

  public isComponentDependent(arr = [], component: CustomComponent): boolean {
    return arr.some((el) => [
      ...(el.relatedRel ? el.relatedRel.split(';') : []),
      el.relatedDate
    ].includes(component.id));
  }

  public getDependentComponents(
    components: CustomComponent[],
    component: CustomComponent,
  ): CustomComponent[] {
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
  public getDictionaryAttributeValue(
    dictionaryAttributeName: string,
    componentId: string,
    components: CustomComponent[],
    componentVal: { [key: string]: string } | '', // @todo. проверить, правильно ли указан тип
    dictionaries: CustomListDictionaries
  ): unknown {
    const relatedComponent = components.find((item) => item.id === componentId);

    if (relatedComponent) {
      const dictKey = getDictKeyByComp(relatedComponent);

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

  public getRelation(
    component: CustomComponent,
    reference: CustomComponentRef
  ): CustomComponentRef {
    return component.attrs.ref?.find(({ relation }) => relation === reference.relation);
  }

  /**
   * Возвращает вычисленное значение по формуле
   * @param formula - формула для расчета
   */
  public getCalcFieldValue(formula: string): number {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func
    return Function(`'use strict'; return (${formula})`)();
  }

  public onAfterFilterOnRel(
    dependentComponent: CustomComponent,
    form: FormArray,
    dictionaryToolsService: DictionaryToolsService | RestToolsService
  ): void {
    if (!Array.isArray(dependentComponent?.attrs?.ref)) {
      return;
    }
    const dependentControl: AbstractControl = form.controls.find(
      (control: AbstractControl) => control.value.id === dependentComponent.id,
    );

    const relationsToHandle = [
      CustomComponentRefRelation.updateRestLookupOn,
      CustomComponentRefRelation.filterOn,
    ];

    dependentComponent?.attrs?.ref
      .filter((reference) => relationsToHandle.includes(reference.relation))
      .forEach((reference) => {
        const refControl: AbstractControl = form.controls.find(
          (control: AbstractControl) => control.value.id === reference.relatedRel,
        );

        this.handleAfterFilterOnRelation(
          reference,
          refControl,
          dependentControl,
          dependentComponent,
          dictionaryToolsService,
        );
      });
  }

  private createRestrictionGroups(rawRestrictions: DateRestriction[]): DateRestrictionGroups {
    const restrictionGroups: {defaultGroup?: DateRestriction[]} = {};

    for (const restriction of rawRestrictions) {
      const childKey = restriction.forChild;
      if (childKey) {
        if (!restrictionGroups.hasOwnProperty(childKey)) {
          restrictionGroups[childKey] = [];
        }
        restrictionGroups[childKey].push(restriction);
      }
    }

    if (!Object.keys(restrictionGroups).length) {
      restrictionGroups[DATE_RESTRICTION_GROUP_DEFAULT_KEY] = rawRestrictions;
    }

    return restrictionGroups;
  }

  private getRefValue(value: string | unknown): unknown {
    const isParsable = this.jsonHelperService.hasJsonStructure(value as string);
    return isParsable ? JSON.parse(value as string) : value;
  }

  private async updateLimitDates(
    component: CustomComponent | CustomListFormGroup,
    components: CustomComponent[],
    form: FormArray,
    applicantAnswers: ApplicantAnswersDto,
    componentsGroupIndex?: number
  ): Promise<void> {
    const relatedComponents = components.filter(
      (relatedComponent) =>
        relatedComponent.attrs.dateRestrictions &&
        relatedComponent.attrs.dateRestrictions.some((restriction) =>
          this.dateRestrictionsService.haveDateRef(restriction),
        ),
    );

    for (let index = 0, len = relatedComponents.length; index < len; index += 1) {
      const restriction = relatedComponents[index].attrs.dateRestrictions.find(
        (restriction) =>
        {
          const [dateId, ] = this.dateRefService.extract(restriction.value as string);
          return this.dateRestrictionsService.haveDateRef(restriction) &&
          dateId === component.id;
        }
      );

      if (restriction) {
        const restrictionGroups = this.createRestrictionGroups(relatedComponents[index].attrs.dateRestrictions);
        for (const [key, value] of Object.entries(restrictionGroups)) {
          const dateRange = await this.dateRestrictionsService.getDateRange(
            relatedComponents[index].id,
            value as unknown as DateRestriction[],
            components,
            form,
            applicantAnswers,
            key,
            componentsGroupIndex
          );
          this.updateFormWithDateRange(form, relatedComponents[index], dateRange, key);
        }

      }
    }
  }

  private async setLimitDates(
    component: CustomComponent | CustomListFormGroup,
    components: CustomComponent[],
    form: FormArray,
    applicantAnswers: ApplicantAnswersDto,
    componentsGroupIndex?: number): Promise<void> {
    const restrictionGroups = this.createRestrictionGroups(component.attrs.dateRestrictions);
    for (const [key, value] of Object.entries(restrictionGroups)) {
      const dateRange = await this.dateRestrictionsService.getDateRange(
        component.id,
        value as unknown as DateRestriction[],
        components,
        form,
        applicantAnswers,
        key,
        componentsGroupIndex
      );
      this.updateFormWithDateRange(form, component, dateRange, key);
    }

  }

  private updateFormWithDateRange(
    form: FormArray,
    component: CustomComponent | CustomListFormGroup,
    dateRange: Range,
    forChild: string
  ): void {
    const control = form.controls.find((control) => control.value.id === component.id);

    if (forChild !== DATE_RESTRICTION_GROUP_DEFAULT_KEY) {
      const attrsValue = control.get('attrs').value;
      const child = attrsValue.components.find(component => component.id === forChild);
      if (child) {
        child.attrs.minDate = dateRange.min;
        child.attrs.maxDate = dateRange.max;
      }
      control.get('attrs').setValue(attrsValue);
      control.get('value').patchValue(control.value.value);
    } else {
      control.get('attrs').patchValue({
        ...component.attrs,
        minDate: dateRange.min || component.attrs.minDate,
        maxDate: dateRange.max || component.attrs.maxDate,
      });
      const isDateInRange =
        control.value.value >= dateRange.min?.getTime() &&
        control.value.value <= dateRange.max?.getTime();
      if (!isDateInRange) {
        control.get('value').patchValue(control.value.value);
      }
    }
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

  private getDependentComponentUpdatedShownElements( // TODO название уже не отражает суть
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: { [key: string]: string }, // @todo. иногда здесь пустая строка вместо объекта
    components: CustomComponent[],
    form: FormArray,
    shownElements: CustomListStatusElements,
    dictionaries: CustomListDictionaries,
    initInitialValues: boolean,
    dictionaryToolsService: DictionaryToolsService,
    screenService: ScreenService,
  ): CustomListStatusElements {
    const dependentControl: AbstractControl = form.controls.find(
      (control: AbstractControl) => control.value.id === dependentComponent.id,
    );
    const isDependentDisabled: boolean = dependentComponent.attrs.disabled;
    const element = shownElements[dependentComponent.id];

    switch (reference.relation) {
      case CustomComponentRefRelation.displayOff:
        this.handleIsDisplayOffRelation(
          element,
          shownElements,
          dependentComponent,
          reference,
          componentVal,
          dependentControl,
        );
        break;
      case CustomComponentRefRelation.displayOn:
        this.handleIsDisplayOnRelation(
          element,
          shownElements,
          dependentComponent,
          reference,
          componentVal,
          dependentControl,
          form,
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
          dependentControl,
        );
        break;
      case CustomComponentRefRelation.disabled:
        this.handleIsDisabledRelation(
          reference,
          componentVal,
          dependentControl,
          dependentComponent,
          form,
        );
        break;
      case CustomComponentRefRelation.filterOn:
        this.handleIsFilterOnRelation(
          reference,
          componentVal,
          dictionaryToolsService,
          screenService,
          dependentComponent,
        );
        break;
      case CustomComponentRefRelation.reset:
        this.handleResetControl(dependentControl, form, reference);
        break;
      case CustomComponentRefRelation.validateDependentControl:
        this.validateDependentControl(dependentControl, form, reference);
        break;
      case CustomComponentRefRelation.autoFillTextFromRefs:
        this.handleAutoFillTextFromRefs(
          reference,
          componentVal,
          dependentControl,
          dependentComponent,
        );
        break;
      case CustomComponentRefRelation.formatOn:
        this.handleFormatOn(reference, componentVal, dependentControl);
        break;
      case CustomComponentRefRelation.updateRestLookupOn:
        this.handleUpdateRestLookupOn(
          reference,
          componentVal,
          dependentControl,
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
        dependentControl.get('value').patchValue(null, { onlySelf: true, emitEvent: false });
      } else {
        dependentControl
          .get('value')
          .patchValue(
            !isEmpty(dependentControl.value.value)
              ? dependentControl.value.value
              : dictionaryAttributeValue,
            { onlySelf: true, emitEvent: false },
          );
      }

      dependentControl.markAsUntouched();
      dependentControl.updateValueAndValidity();
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
    const isShown = !this.refRelationService.isValueEquals(reference.val, componentVal);

    if (element.isShown === true || !isDisplayOn) {
      shownElements[dependentComponent.id] = {
        relation: CustomComponentRefRelation.displayOff,
        isShown,
      };
      dependentControl.markAsUntouched();
    }
  }

  private handleIsDisplayOnRelation(
    element: CustomStatusElement,
    shownElements: CustomListStatusElements,
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: { [key: string]: string },
    dependentControl: AbstractControl,
    form: FormArray,
  ): void {
    const isDisplayOff = this.refRelationService.isDisplayOffRelation(element.relation);
    const isShown = this.refRelationService.isValueEquals(reference.val, componentVal);

    if (element.isShown === true || !isDisplayOff) {
      shownElements[dependentComponent.id] = {
        relation: CustomComponentRefRelation.displayOn,
        isShown,
      };
      if (reference.isResetable && !isShown) {
        this.handleResetControl(dependentControl, form, reference);
        const control = dependentControl.get('value');
        control.markAllAsTouched();
        control.updateValueAndValidity();
      }
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
    dependentControl.get('value').patchValue(newValue, { onlySelf: true, emitEvent: false });
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
    dependentControl.get('value').patchValue(newValue, { onlySelf: true, emitEvent: false });
  }

  private handleIsFilterOnRelation(
    reference: CustomComponentRef,
    componentVal: { [key: string]: string },
    dictionaryToolsService: DictionaryToolsService,
    screenService: ScreenService,
    dependentComponent: CustomComponent,
  ): void {
    if (
      this.refRelationService.isValueEquals(reference.val, componentVal) &&
      dictionaryToolsService.isDictionaryLike(dependentComponent.type)
    ) {
      const filter = dictionaryToolsService.getFilterOptions(
        componentVal,
        screenService.getStore(),
        reference.dictionaryFilter,
      );
      this.applyFilter(dependentComponent.id, filter.filter);
    } else {
      this.clearFilter(dependentComponent.id);
    }
  }

  private handleAfterFilterOnRelation(
    reference: CustomComponentRef,
    refControl: AbstractControl,
    dependentControl: AbstractControl,
    dependentComponent: CustomComponent,
    dictionaryToolsService: DictionaryToolsService | RestToolsService,
  ): void {
    if (refControl.touched) {
      if (dictionaryToolsService.isResultEmpty(dependentComponent)) {
        dependentControl.get('value').patchValue(reference.defaultValue || '');
        dependentControl.get('value').markAsUntouched();
        dependentControl.disable({ onlySelf: true, emitEvent: false });
      } else if (dependentControl.disabled) {
        dependentControl.enable({ onlySelf: true, emitEvent: false });
      }
    }
  }

  private handleFormatOn(
    reference: CustomComponentRef,
    componentVal: ComponentValueChangeDto,
    dependentControl: AbstractControl,
  ): void {
    const newValue = {
      ...(dependentControl?.value?.value ?? {}),
      [reference.relatedRel]: { ...componentVal },
    };
    dependentControl.patchValue(
      { ...dependentControl?.value, value: newValue },
      { onlySelf: true, emitEvent: false },
    );
  }

  private handleUpdateRestLookupOn(
    reference: CustomComponentRef,
    componentVal: ComponentValueChangeDto,
    dependentControl: AbstractControl,
    dependentComponent: CustomComponent,
  ): void {
    dependentControl.get('value').patchValue(reference.defaultValue || '');
    if ( this.refRelationService.isValueEquals(reference.val, componentVal) ) {
      if (this.restUpdates[dependentComponent.id]) {
        this.restUpdates = { [dependentComponent.id]: null };
      }
      this.restUpdates = {
        [dependentComponent.id]: {
          rest: reference.rest,
          value: {
            ...(this.restUpdates[dependentComponent.id]?.value || {}),
            [reference.relatedRel]: componentVal,
          }
        }
      };
    } else {
      this.restUpdates = { [dependentComponent.id]: null };
    }
  }

  private patchValueAndDisable(
    dependentComponentId: string,
    control: AbstractControl,
    defaultValue?: string | boolean,
  ): void {
    // ничего не делаем, если контрол уже деактивирован, чтобы сохранить значение в prevValues
    if (control.disabled) {
      return;
    }
    const valueControl: AbstractControl = control.get('value');
    this.prevValues[dependentComponentId] = valueControl.value;
    valueControl.patchValue(defaultValue || '', { onlySelf: true, emitEvent: false });
    valueControl.markAsUntouched();
    control.disable({ onlySelf: true, emitEvent: false });
  }

  private patchToPrevValueAndEnable(dependentComponentId: string, control: AbstractControl): void {
    const isFindAndValue: boolean =
      !isUndefined(this.prevValues[dependentComponentId]) &&
      !!String(this.prevValues[dependentComponentId]);
    if (isFindAndValue) {
      control
        .get('value')
        .patchValue(this.prevValues[dependentComponentId], { onlySelf: true, emitEvent: false });
    }
    control.enable({ onlySelf: true, emitEvent: false });
  }

  private handleIsDisabledRelation(
    reference: CustomComponentRef,
    componentVal: { [key: string]: string },
    dependentControl: AbstractControl,
    dependentComponent: CustomComponent,
    form: FormArray,
  ): void {
    const dependentComponentId = dependentComponent.id;

    if (this.refRelationService.isValueEquals(reference.val, componentVal)) {
      this.patchValueAndDisable(dependentComponentId, dependentControl, reference.defaultValue);
    } else if (!this.componentHasAnyDisabledRefsWithSameValue(dependentComponent, form)) {
      // включаем контрол только если нет ни одного disabled рефа с таким же значением
      this.patchToPrevValueAndEnable(dependentComponentId, dependentControl);
    }
  }

  /**
   * Возвращает true, если значение у компонента есть хотя бы один реф с relation disabled, у которого значение совпадает
   * со значением контрола
   * @param component
   * @param form
   */
  private componentHasAnyDisabledRefsWithSameValue(
    component: CustomComponent,
    form: FormArray,
  ): boolean {
    return component.attrs.ref.some((itemReference) => {
      if (itemReference.relation !== CustomComponentRefRelation.disabled) {
        return false;
      }
      const itemControl = form.controls.find((ctrl) => ctrl.value.id === itemReference.relatedRel);
      return this.refRelationService.isValueEquals(
        itemReference.val,
        itemControl.get('value').value,
      );
    });
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

  private handleResetControl(
    dependentControl: AbstractControl,
    form: FormArray,
    reference: CustomComponentRef,
  ): void {
    const { value } = form.controls.find((control) => control.value.id === reference.relatedRel);
    const controlValue = value.value?.id || value.value;
    if (
      !this.refRelationService.isValueEquals(
        controlValue,
        (reference.val as string) || this.prevValues[value.id],
      )
    ) {
      dependentControl.get('value').reset();
    }
    this.prevValues[value.id] = controlValue;
  }

  private validateDependentControl(
    dependentControl: AbstractControl,
    form: FormArray,
    reference: CustomComponentRef,
  ): void {
    const control = dependentControl.get('value');
    const refControl = form.controls.find((control) => control.value.id === reference.relatedRel);
    if (control.value || (refControl.touched && refControl.value.value && control.value)) {
      control.markAllAsTouched();
      control.updateValueAndValidity();
    }
  }

  private handleAutoFillTextFromRefs(
    reference: CustomComponentRef,
    componentVal: { [key: string]: string },
    dependentControl: AbstractControl,
    dependentComponent: CustomComponent,
  ): void {
    if (componentVal) {
      const newValue = JSON.stringify(dependentComponent).replace(/\${\w+}/gi, (match) => {
        const relatedRelKey = match.replace(/[^\w]+/gi, '');
        const relatedRelValue = reference.relatedRelValues[relatedRelKey];
        if (relatedRelValue) {
          return get(componentVal, relatedRelValue);
        }
        return match;
      });
      dependentControl.patchValue(
        { ...JSON.parse(newValue) },
        { onlySelf: true, emitEvent: false },
      );
    }
  }
}
