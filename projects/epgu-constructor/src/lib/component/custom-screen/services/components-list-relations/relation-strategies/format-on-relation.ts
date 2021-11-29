import { BaseRelation } from './base-relation';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { CustomComponent, CustomComponentRef, CustomListStatusElements } from '../../../components-list.types';
import { AbstractControl, FormArray } from '@angular/forms';

export class FormatOnRelation extends BaseRelation {
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
    const newValue = {
      ...(dependentControl?.value?.value ?? {}),
      [reference.relatedRel]: { ...componentVal },
    };
    dependentControl.patchValue(
      { ...dependentControl?.value, value: newValue },
      { onlySelf: true, emitEvent: false },
    );

    return this.afterHandleRelation(shownElements, dependentComponent, form);
  }
}
