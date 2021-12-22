import { BaseRelation } from './base-relation';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { CustomComponent, CustomComponentRef } from '../../../components-list.types';
import { FormArray } from '@angular/forms';
import { ComponentRestUpdates } from '../components-list-relations.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import BaseModel from '../../../component-list-resolver/BaseModel';
import GenericAttrs from '../../../component-list-resolver/GenericAttrs';
import { Injectable } from '@angular/core';

@Injectable()
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
    dependentComponent: CustomComponent | BaseModel<GenericAttrs>,
    reference: CustomComponentRef,
    componentVal: KeyValueMap,
    form: FormArray,
  ): void {
    const dependentControl = this.getControlById(dependentComponent.id, form);
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

    this.afterHandleRelation(dependentComponent, form);
  }
}
