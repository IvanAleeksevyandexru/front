import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { AbstractControl, FormArray } from '@angular/forms';
import { BaseRelation } from './base-relation';
import {
  CustomComponent,
  CustomComponentRef,
  CustomListStatusElements,
} from '../../../components-list.types';

export class ResetControlRelation extends BaseRelation {
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
    this.handleResetControl(dependentControl, form, reference);

    return this.afterHandleRelation(shownElements, dependentComponent, form);
  }
}
