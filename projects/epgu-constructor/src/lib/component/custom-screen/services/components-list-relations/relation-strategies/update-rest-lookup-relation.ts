import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { AbstractControl, FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseRelation } from './base-relation';
import {
  CustomComponent,
  CustomComponentRef,
  CustomListStatusElements,
} from '../../../components-list.types';
import { ComponentRestUpdates } from '../components-list-relations.interface';

export class UpdateRestLookupRelation extends BaseRelation {
  private readonly _restUpdates$: BehaviorSubject<ComponentRestUpdates> = new BehaviorSubject({});

  private get restUpdates(): ComponentRestUpdates {
    return this._restUpdates$.getValue();
  }

  private set restUpdates(val: ComponentRestUpdates) {
    this._restUpdates$.next(val);
  }

  public get restUpdates$(): Observable<ComponentRestUpdates> {
    return this._restUpdates$.asObservable();
  }

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
    dependentControl.get('value').patchValue(reference.defaultValue || '');
    if (this.refRelationService.isValueEquals(reference.val, componentVal)) {
      if (this.restUpdates[dependentComponent.id]) {
        this.restUpdates = { [dependentComponent.id]: null };
      }
      this.restUpdates = {
        [dependentComponent.id]: {
          rest: reference.rest,
          value: {
            ...(this.restUpdates[dependentComponent.id]?.value || {}),
            [reference.relatedRel]: componentVal,
          },
        },
      };
    } else {
      this.restUpdates = { [dependentComponent.id]: null };
    }

    return this.afterHandleRelation(shownElements, dependentComponent, form);
  }
}
