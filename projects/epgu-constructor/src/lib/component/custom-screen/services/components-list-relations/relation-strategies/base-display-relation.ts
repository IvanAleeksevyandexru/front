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
  private timeOutEnabled = false;

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
    dependentComponent: CustomComponent | BaseModel<GenericAttrs>,
    shownElements: CustomListStatusElements,
    form: FormArray,
    cachedAnswers: CachedAnswers,
  ): boolean {
    return (dependentComponent.attrs?.ref || [])
      .filter((reference) => this.isCurrentRelation(reference.relation))
      .some((reference) => this.isReferenceFired(reference, shownElements, form, cachedAnswers));
  }

  protected isReferenceFired(
    reference: CustomComponentRef,
    shownElements: CustomListStatusElements,
    form: FormArray,
    cachedAnswers: CachedAnswers,
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
      return this.calculateTimeRelatedValue(reference.val, reference.path, form, cachedValue);
    }
    const isOnCurrentScreen = this.hasControlWithIdOnForm(reference.relatedRel, form);
    if (isOnCurrentScreen) {
      return (
        shownElements[reference.relatedRel]?.isShown &&
        this.refRelationService.isValueEquals(
          this.getRefValue(reference.val) as string | string[] | boolean,
          reference.path
            ? get(this.getControlValueById(reference.relatedRel, form), reference.path)
            : this.getControlValueById(reference.relatedRel, form),
        )
      );
    }

    return this.refRelationService.isValueEquals(
      reference.val,
      get(this.getRefValue(cachedValue), reference.path) || cachedValue,
    );
  }

  protected calculateTimeRelatedValue(
    referenceValue: string,
    path: string,
    form: FormArray,
    cachedValue: string,
  ): boolean {
    const currentDate = new Date();
    const targetDate = new Date(get(this.getRefValue(cachedValue), path));
    const currentIsGreaterOrEqual = currentDate >= targetDate;
    let shouldShow;
    if (referenceValue === 'dateTimeAfter') {
      shouldShow = currentIsGreaterOrEqual;
    } else if (referenceValue === 'dateTimeBefore') {
      shouldShow = !currentIsGreaterOrEqual;
    }
    if (!currentIsGreaterOrEqual && !this.timeOutEnabled) {
      const diff = this.datesToolsService.diff(targetDate, currentDate);
      setTimeout(() => {
        form.controls[0].updateValueAndValidity({ onlySelf: false, emitEvent: true });
      }, diff);
      this.timeOutEnabled = true;
    }
    return shouldShow;
  }

  protected abstract isCurrentRelation(relation: CustomComponentRefRelation): boolean;
}
