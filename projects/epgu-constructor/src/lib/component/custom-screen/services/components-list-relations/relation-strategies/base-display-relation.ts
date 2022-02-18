import { BaseRelation } from './base-relation';
import {
  CustomComponentRefRelation,
  KeyValueMap,
  TimeRelatedValue,
} from '@epgu/epgu-constructor-types';
import {
  CustomComponent,
  CustomComponentRef,
  CustomListStatusElements,
  IEntityWithRef,
} from '../../../components-list.types';
import { FormArray } from '@angular/forms';
import { CachedAnswers } from '../../../../../screen/screen.types';
import { get } from 'lodash';
import BaseModel from '../../../component-list-resolver/BaseModel';
import GenericAttrs from '../../../component-list-resolver/GenericAttrs';
import { Injectable, Injector } from '@angular/core';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';

@Injectable()
export abstract class BaseDisplayRelation extends BaseRelation {
  private timeouts = {};

  private datesToolsService: DatesToolsService;

  constructor(protected injector: Injector) {
    super(injector);
    this.datesToolsService = injector.get(DatesToolsService);
  }

  public handleRelation(
    dependentComponent: CustomComponent | BaseModel<GenericAttrs>,
    _reference: CustomComponentRef,
    _componentVal: KeyValueMap,
    form: FormArray,
  ): void {
    this.afterHandleRelation(dependentComponent, form);
  }

  public isAtLeastOneRelationFired(
    dependentEntity: IEntityWithRef,
    shownElements: CustomListStatusElements,
    form: FormArray,
    cachedAnswers: CachedAnswers,
  ): boolean {
    return (dependentEntity.attrs?.ref || [])
      .filter((reference) => this.isCurrentRelation(reference.relation))
      .some((reference) =>
        this.isReferenceFired(reference, shownElements, form, cachedAnswers, dependentEntity.id),
      );
  }

  protected isReferenceFired(
    reference: CustomComponentRef,
    shownElements: CustomListStatusElements,
    form: FormArray,
    cachedAnswers: CachedAnswers,
    entityId: string,
  ): boolean {
    const cachedValue = cachedAnswers[reference.relatedRel]?.value;
    const listOfDateValue: string[] = [
      TimeRelatedValue.dateTimeAfter,
      TimeRelatedValue.dateTimeBefore,
    ];
    if (
      typeof reference.val === 'string' &&
      listOfDateValue.includes(reference.val) &&
      form.controls.length
    ) {
      return this.calculateTimeRelatedValue(
        reference.val,
        reference.path,
        form,
        cachedValue,
        entityId,
      );
    }
    const isOnCurrentScreen = this.hasControlWithIdOnForm(reference.relatedRel, form);
    const parsedRefValue = this.getRefValue(reference.val) as string | string[] | boolean;
    if (isOnCurrentScreen) {
      const parsedForm = this.getRefValue(this.getControlValueById(reference.relatedRel, form));

      return (
        shownElements[reference.relatedRel]?.isShown &&
        this.refRelationService.isValueEquals(
          parsedRefValue,
          reference.path ? get(parsedForm, reference.path) : parsedForm,
        )
      );
    }

    return this.refRelationService.isValueEquals(
      parsedRefValue,
      get(this.getRefValue(cachedValue), reference.path) || cachedValue,
    );
  }

  protected calculateTimeRelatedValue(
    referenceValue: string,
    path: string,
    form: FormArray,
    cachedValue: string,
    entityId: string,
  ): boolean {
    const currentDate = new Date();
    const targetDate = new Date(get(this.getRefValue(cachedValue), path));
    const currentIsGreaterOrEqual = currentDate >= targetDate;
    let shouldShow;
    if (referenceValue === TimeRelatedValue.dateTimeAfter) {
      shouldShow = currentIsGreaterOrEqual;
    } else if (referenceValue === TimeRelatedValue.dateTimeBefore) {
      shouldShow = !currentIsGreaterOrEqual;
    }
    if (!currentIsGreaterOrEqual && !this.timeouts[entityId]) {
      const diff = this.datesToolsService.diff(targetDate, currentDate);
      setTimeout(() => {
        form.controls[0].updateValueAndValidity({ onlySelf: false, emitEvent: true });
      }, diff);
      this.timeouts[entityId] = true;
    }
    return shouldShow;
  }

  protected abstract isCurrentRelation(relation: CustomComponentRefRelation): boolean;
}
