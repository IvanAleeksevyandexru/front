import { BaseRelation } from './base-relation';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { CustomComponent, CustomComponentRef } from '../../../components-list.types';
import { FormArray } from '@angular/forms';
import BaseModel from '../../../component-list-resolver/BaseModel';
import GenericAttrs from '../../../component-list-resolver/GenericAttrs';
import { Injectable } from '@angular/core';

@Injectable()
export class ValidateDependentRelation extends BaseRelation {
  public handleRelation(
    dependentComponent: CustomComponent | BaseModel<GenericAttrs>,
    reference: CustomComponentRef,
    _componentVal: KeyValueMap,
    form: FormArray,
  ): void {
    const dependentControl = this.getControlById(dependentComponent.id, form);
    const control = dependentControl.get('value');
    const refControl = this.getControlById(reference.relatedRel, form);
    if (control.value || (refControl.touched && refControl.value.value && control.value)) {
      control.markAllAsTouched();
      control.updateValueAndValidity();
    }

    const isDependentDisabled: boolean = dependentComponent.attrs.disabled;
    if (isDependentDisabled) {
      dependentControl.disable();
    }

    this.afterHandleRelation(dependentComponent, form);
  }
}
