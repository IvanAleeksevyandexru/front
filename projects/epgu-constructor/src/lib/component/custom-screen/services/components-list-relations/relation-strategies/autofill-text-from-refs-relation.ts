import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { AbstractControl, FormArray } from '@angular/forms';
import { get } from 'lodash';
import {
  CustomComponent,
  CustomComponentRef,
  CustomListStatusElements,
} from '../../../components-list.types';
import { BaseRelation } from './base-relation';

export class AutofillTextFromRefsRelation extends BaseRelation {
  public handleRelation(
    shownElements: CustomListStatusElements,
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: KeyValueMap,
    form: FormArray,
  ): CustomListStatusElements {
    const dependentControl: AbstractControl = form.controls.find(
      (control: AbstractControl) => control.value.id === dependentComponent.id,
    );
    if (componentVal) {
      const newValue = JSON.stringify(dependentComponent).replace(/\${\w+}/gi, (match) => {
        const relatedRelKey = match.replace(/[^\w]+/gi, '');
        const relatedRelValue = reference.relatedRelValues[relatedRelKey];
        if (relatedRelValue) {
          return get(componentVal, relatedRelValue) as string;
        }
        return match;
      });
      dependentControl.patchValue(
        { ...JSON.parse(newValue) },
        { onlySelf: true, emitEvent: false },
      );
    }

    const isDependentDisabled: boolean = dependentComponent.attrs.disabled;
    if (isDependentDisabled) {
      dependentControl.disable();
    }

    return this.afterHandleRelation(shownElements, dependentComponent, form);
  }
}
