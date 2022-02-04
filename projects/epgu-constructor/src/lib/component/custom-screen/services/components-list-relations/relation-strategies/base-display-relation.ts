import { BaseRelation } from './base-relation';
import { CustomComponentRefRelation, KeyValueMap } from '@epgu/epgu-constructor-types';
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
import { Injectable } from '@angular/core';

@Injectable()
export abstract class BaseDisplayRelation extends BaseRelation {
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

    const cachedValue = cachedAnswers[reference.relatedRel]?.value;

    return this.refRelationService.isValueEquals(
      parsedRefValue,
      get(this.getRefValue(cachedValue), reference.path) || cachedValue,
    );
  }

  protected abstract isCurrentRelation(relation: CustomComponentRefRelation): boolean;
}
