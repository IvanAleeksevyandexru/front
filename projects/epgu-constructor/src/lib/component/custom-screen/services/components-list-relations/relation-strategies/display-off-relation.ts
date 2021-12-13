import { BaseRelation } from './base-relation';
import { CustomComponentRefRelation, KeyValueMap } from '@epgu/epgu-constructor-types';
import {
  CustomComponent,
  CustomComponentRef,
  CustomListStatusElements,
} from '../../../components-list.types';
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
    const refs = dependentComponent.attrs.ref;
    const isShown = !refs
      .filter(
        (ref) =>
          this.refRelationService.isDisplayOffRelation(ref.relation) &&
          this.hasControlWithIdOnForm(ref.relatedRel, form),
      )
      .some((ref) => {
        return (
          this.refRelationService.isValueEquals(
            reference.val,
            this.getControlValueById(ref.relatedRel, form),
          ) && shownElements[ref.relatedRel]?.isShown
        );
      });

    const isDisplayOn = this.refRelationService.isDisplayOnRelation(element.relation);
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
