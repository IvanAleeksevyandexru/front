import { BaseRelation } from './base-relation';
import { CustomComponentRefRelation, KeyValueMap } from '@epgu/epgu-constructor-types';
import { CustomComponent, CustomComponentRef, CustomListStatusElements } from '../../../components-list.types';
import { AbstractControl, FormArray } from '@angular/forms';

export class DisplayOffRelation extends BaseRelation {
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
    const element = shownElements[dependentComponent.id];
    const isDisplayOn = this.refRelationService.isDisplayOnRelation(element.relation);
    const refs = dependentComponent.attrs.ref;
    const isShown = !refs.some((ref) => {
      return this.refRelationService.isDisplayOffRelation(ref.relation) &&
        this.refRelationService.isValueEquals(reference.val, this.getControlValueById(ref.relatedRel, form)) &&
        shownElements[ref.relatedRel]?.isShown;
    });

    if (element.isShown === true || !isDisplayOn) {
      shownElements[dependentComponent.id] = {
        relation: CustomComponentRefRelation.displayOff,
        isShown,
      };
      dependentControl.markAsUntouched();
    }
    return this.afterHandleRelation(shownElements, dependentComponent, form);
  }
}
