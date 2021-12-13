import { BaseRelation } from './base-relation';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import {
  CustomComponent,
  CustomComponentRef,
  CustomListStatusElements,
} from '../../../components-list.types';
import { AbstractControl, FormArray } from '@angular/forms';

export class ValidateDependentRelation extends BaseRelation {
  public handleRelation(
    shownElements: CustomListStatusElements,
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    _componentVal: KeyValueMap,
    form: FormArray,
  ): CustomListStatusElements {
    const dependentControl: AbstractControl = form.controls.find(
      (control: AbstractControl) => control.value.id === dependentComponent.id,
    );
    const control = dependentControl.get('value');
    const refControl = form.controls.find(
      (abstractControl) => abstractControl.value.id === reference.relatedRel,
    );
    if (control.value || (refControl.touched && refControl.value.value && control.value)) {
      control.markAllAsTouched();
      control.updateValueAndValidity();
    }

    const isDependentDisabled: boolean = dependentComponent.attrs.disabled;
    if (isDependentDisabled) {
      dependentControl.disable();
    }

    return this.afterHandleRelation(shownElements, dependentComponent, form);
  }
}
