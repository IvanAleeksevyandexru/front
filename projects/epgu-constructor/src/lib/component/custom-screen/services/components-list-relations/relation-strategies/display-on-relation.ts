import { BaseRelation } from './base-relation';
import { CustomComponentRefRelation, KeyValueMap } from '@epgu/epgu-constructor-types';
import { CustomComponent, CustomComponentRef, CustomListStatusElements } from '../../../components-list.types';
import { AbstractControl, FormArray } from '@angular/forms';

export class DisplayOnRelation extends BaseRelation {
  public handleRelation(
    shownElements: CustomListStatusElements,
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: KeyValueMap,
    form: FormArray,
  ): CustomListStatusElements {
    const element = shownElements[dependentComponent.id];
    const dependentControl: AbstractControl = form.controls.find(
      (control: AbstractControl) => control.value.id === dependentComponent.id,
    );
    const isDisplayOff = this.refRelationService.isDisplayOffRelation(element.relation);
    const isShown = this.refRelationService.isValueEquals(reference.val, componentVal);

    if (element.isShown === true || !isDisplayOff) {
      shownElements[dependentComponent.id] = {
        relation: CustomComponentRefRelation.displayOn,
        isShown,
      };
      if (reference.isResetable && !isShown) {
        this.handleResetControl(dependentControl, form, reference);
        const control = dependentControl.get('value');
        control.markAllAsTouched();
        control.updateValueAndValidity();
      }
      dependentControl.markAsUntouched();
    }

    return this.afterHandleRelation(shownElements, dependentComponent, form);
  }
}
