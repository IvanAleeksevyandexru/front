import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import {
  CustomComponent,
  CustomListFormGroup,
  CustomListStatusElements,
  DATE_RESTRICTION_GROUP_DEFAULT_KEY,
  DateRestriction,
  DateRestrictionGroups,
} from '../../components-list.types';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { ScreenService } from '../../../../screen/screen.service';
import { DateRangeRef, Range } from '../../../../shared/services/date-range/date-range.models';
import { CachedAnswers } from '../../../../screen/screen.types';
import {
  ApplicantAnswersDto,
  CustomComponentRefRelation,
  KeyValueMap,
} from '@epgu/epgu-constructor-types';
import { DateRestrictionsService } from '../../../../shared/services/date-restrictions/date-restrictions.service';
import { DateRefService } from '../../../../core/services/date-ref/date-ref.service';
import DictionaryLikeModel from '../../component-list-resolver/DictionaryLikeModel';
import { UpdateRestLookupRelation } from './relation-strategies/update-rest-lookup-relation';
import { ComponentRestUpdates, UpdateFiltersEvents } from './components-list-relations.interface';
import { Observable } from 'rxjs';
import { RelationResolverService } from './relation-resolver.service';
import { FilterOnRelation } from './relation-strategies/filter-on-relation';
import { BaseRelation } from './relation-strategies/base-relation';
import { DisplayOffRelation } from './relation-strategies/display-off-relation';
import { DisplayOnRelation } from './relation-strategies/display-on-relation';
import BaseModel from '../../component-list-resolver/BaseModel';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

@Injectable()
export class ComponentsListRelationsService {
  public get restUpdates$(): Observable<ComponentRestUpdates> {
    const relationStrategy: UpdateRestLookupRelation = this.relationResolverService.getStrategy(
      CustomComponentRefRelation.updateRestLookupOn,
    ) as UpdateRestLookupRelation;

    return relationStrategy.restUpdates$;
  }

  public get filters$(): Observable<UpdateFiltersEvents> {
    const relationStrategy: FilterOnRelation = this.relationResolverService.getStrategy(
      CustomComponentRefRelation.filterOn,
    ) as FilterOnRelation;

    return relationStrategy.filters$;
  }

  constructor(
    private dateRangeService: DateRangeService,
    private dateRestrictionsService: DateRestrictionsService,
    private dateRefService: DateRefService,
    private relationResolverService: RelationResolverService,
  ) {}

  public processRelations(
    components: (CustomComponent | BaseModel<GenericAttrs>)[],
    component: CustomListFormGroup | CustomComponent | BaseModel<GenericAttrs>,
    shownElements: CustomListStatusElements,
    form: FormArray,
    initInitialValues = false,
    screenService: ScreenService,
    componentsGroupIndex?: number,
  ): CustomListStatusElements {
    this.getDependentComponents(components, <CustomComponent>component).forEach(
      (dependentComponent: CustomComponent) => {
        dependentComponent.attrs.ref
          // апдейт только при изменении значений компонента, у которого указаны связи
          ?.filter((el) =>
            (el.relatedRel ? el.relatedRel.split(';') : []).some((e) => e === component.id),
          )
          .forEach((reference) => {
            const value = reference.valueFromCache
              ? screenService.cachedAnswers[reference.valueFromCache].value
              : component.value ?? component.valueFromCache;

            const isMassStrategy = this.relationResolverService.isMassStrategy(reference.relation);
            const strategy: BaseRelation = this.relationResolverService.getStrategy(
              reference.relation,
            );

            if (strategy && !isMassStrategy) {
              strategy.handleRelation(
                dependentComponent,
                reference,
                value as KeyValueMap,
                form,
                components,
                initInitialValues,
              );
            } else if (!strategy) {
              console.error(
                `Undefined relation ${reference.relation} for component ${dependentComponent.id}`,
              );
            }
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

    return this.calculateVisibility(components, screenService.cachedAnswers, form, shownElements);
  }

  async updateLimitDatesByDateRestrictions(
    components: CustomComponent[],
    component: CustomComponent | CustomListFormGroup,
    form: FormArray,
    applicantAnswers: ApplicantAnswersDto,
    initInitialValues: boolean,
    componentsGroupIndex?: number,
  ): Promise<void> {
    if (component.attrs?.dateRestrictions && !initInitialValues) {
      await this.setLimitDates(component, form, applicantAnswers, componentsGroupIndex);
      return;
    }

    if (initInitialValues) {
      await this.updateLimitDates(
        component,
        components,
        form,
        applicantAnswers,
        componentsGroupIndex,
      );
    }
  }

  public calculateVisibility(
    components: CustomComponent[],
    cachedAnswers: CachedAnswers,
    form: FormArray,
    previousStatusElements: CustomListStatusElements = {},
  ): CustomListStatusElements {
    return components.reduce((acc, component: CustomComponent) => {
      const hasDisplayOn = this.hasRelation(component, CustomComponentRefRelation.displayOn);
      const isDisplayOnFired = (<DisplayOnRelation>(
        this.relationResolverService.getStrategy(CustomComponentRefRelation.displayOn)
      )).isAtLeastOneRelationFired(component, acc, form, cachedAnswers);

      const isDisplayOffFired = (<DisplayOffRelation>(
        this.relationResolverService.getStrategy(CustomComponentRefRelation.displayOff)
      )).isAtLeastOneRelationFired(component, acc, form, cachedAnswers);

      const isShown = (!hasDisplayOn || isDisplayOnFired) && !isDisplayOffFired;

      if (
        !previousStatusElements[component.id] ||
        previousStatusElements[component.id].isShown != isShown
      ) {
        const dependentControl = form.controls.find((control) => control.value.id === component.id);
        dependentControl?.markAsUntouched();
      }

      return {
        ...acc,
        [component.id]: { isShown },
      };
    }, previousStatusElements);
  }

  public isComponentDependent(arr = [], component: CustomComponent): boolean {
    return arr.some((el) =>
      [...(el.relatedRel ? el.relatedRel.split(';') : []), el.relatedDate].includes(component.id),
    );
  }

  public getDependentComponents(
    components: CustomComponent[],
    component: CustomComponent,
  ): CustomComponent[] {
    return components.filter((_component: CustomComponent) =>
      this.isComponentDependent(_component.attrs?.ref, component),
    );
  }

  /**
   * Возвращает значение атрибута attributeName из словаря компонента componentId.
   * Если атрибут не найден, то возвращается undefined.
   */
  public getDictionaryAttributeValue(
    dictionaryAttributeName: string,
    componentId: string,
    components: CustomComponent[],
    componentVal: KeyValueMap | '',
  ): unknown {
    const relatedComponent = components.find(
      (item) => item.id === componentId,
    ) as DictionaryLikeModel;
    if (relatedComponent) {
      return relatedComponent.getAttributeValue(componentVal, dictionaryAttributeName);
    }
    return undefined;
  }

  public hasRelation(component: CustomComponent, relation: CustomComponentRefRelation): boolean {
    return component.attrs?.ref?.some((o) => o.relation === relation);
  }

  private createRestrictionGroups(rawRestrictions: DateRestriction[]): DateRestrictionGroups {
    const restrictionGroups: { defaultGroup?: DateRestriction[] } = {};

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

  private async updateLimitDates(
    component: CustomComponent | CustomListFormGroup,
    components: CustomComponent[],
    form: FormArray,
    applicantAnswers: ApplicantAnswersDto,
    componentsGroupIndex?: number,
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
        (dateRestriction) => {
          const [datePath] = this.dateRefService.extract(dateRestriction.value as string);
          const relatedComponentId = datePath.split('.')[0];
          return (
            this.dateRestrictionsService.haveDateRef(dateRestriction) &&
            relatedComponentId === component.id
          );
        },
      );

      if (restriction) {
        const restrictionGroups = this.createRestrictionGroups(
          relatedComponents[index].attrs.dateRestrictions,
        );
        for (const [key, value] of Object.entries(restrictionGroups)) {
          const dateRange = await this.dateRestrictionsService.getDateRange(
            relatedComponents[index].id,
            (value as unknown) as DateRestriction[],
            form,
            applicantAnswers,
            key,
            componentsGroupIndex,
          );
          this.updateFormWithDateRange(form, relatedComponents[index], dateRange, key);
        }
      }
    }
  }

  private async setLimitDates(
    component: CustomComponent | CustomListFormGroup,
    form: FormArray,
    applicantAnswers: ApplicantAnswersDto,
    componentsGroupIndex?: number,
  ): Promise<void> {
    const restrictionGroups = this.createRestrictionGroups(component.attrs.dateRestrictions);
    for (const [key, value] of Object.entries(restrictionGroups)) {
      const dateRange = await this.dateRestrictionsService.getDateRange(
        component.id,
        (value as unknown) as DateRestriction[],
        form,
        applicantAnswers,
        key,
        componentsGroupIndex,
      );
      this.updateFormWithDateRange(form, component, dateRange, key);
    }
  }

  private updateFormWithDateRange(
    form: FormArray,
    component: CustomComponent | CustomListFormGroup,
    dateRange: Range,
    forChild: string,
  ): void {
    const control = form.controls.find((formControl) => formControl.value.id === component.id);

    if (forChild !== DATE_RESTRICTION_GROUP_DEFAULT_KEY) {
      const attrsValue = control.get('attrs').value;
      const child = attrsValue.components.find(
        (currentComponent) => currentComponent.id === forChild,
      );
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
}
