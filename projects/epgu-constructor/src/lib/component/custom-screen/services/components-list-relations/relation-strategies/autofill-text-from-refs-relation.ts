import { BaseRelation } from './base-relation';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { CustomComponent, CustomComponentRef } from '../../../components-list.types';
import { FormArray } from '@angular/forms';
import { get } from 'lodash';
import BaseModel from '../../../component-list-resolver/BaseModel';
import GenericAttrs from '../../../component-list-resolver/GenericAttrs';
import { InterpolationService } from '../../../../../shared/services/interpolation/interpolation.service';
import { Injectable, Injector } from '@angular/core';

@Injectable()
export class AutofillTextFromRefsRelation extends BaseRelation {
  protected interpolationService: InterpolationService;

  constructor(protected injector: Injector) {
    super(injector);
    this.interpolationService = this.injector.get(InterpolationService);
  }

  public handleRelation(
    dependentComponent: CustomComponent | BaseModel<GenericAttrs>,
    reference: CustomComponentRef,
    componentVal: KeyValueMap,
    form: FormArray,
  ): void {
    const dependentControl = this.getControlById(dependentComponent.id, form);
    if (componentVal) {
      // when dependentComponent instanceof DictionaryLikeModel JSON.stringify produces circular structure to JSON error
      const componentDto: CustomComponent =
        dependentComponent instanceof BaseModel
          ? dependentComponent.asObject()
          : dependentComponent;

      const variables = Object.keys(reference.relatedRelValues).reduce(
        (acc: KeyValueMap, relatedRelKey): KeyValueMap => ({
          ...acc,
          [relatedRelKey]: get(componentVal, reference.relatedRelValues[relatedRelKey]),
        }),
        {},
      );

      const interpolatedValue = this.interpolationService.interpolateRecursive(
        componentDto,
        variables,
        '',
        true,
      );
      const newValue =
        dependentComponent instanceof BaseModel
          ? new (dependentComponent.constructor as ObjectConstructor)(interpolatedValue)
          : interpolatedValue;

      dependentControl.patchValue(newValue, { onlySelf: true, emitEvent: false });
    }

    const isDependentDisabled: boolean = dependentComponent.attrs.disabled;
    if (isDependentDisabled) {
      dependentControl.disable();
    }

    this.afterHandleRelation(dependentComponent, form);
  }
}
