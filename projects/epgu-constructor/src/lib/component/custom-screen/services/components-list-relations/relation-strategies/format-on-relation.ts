import { BaseRelation } from './base-relation';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { CustomComponent, CustomComponentRef } from '../../../components-list.types';
import { FormArray } from '@angular/forms';
import BaseModel from '../../../component-list-resolver/BaseModel';
import GenericAttrs from '../../../component-list-resolver/GenericAttrs';
import { Injectable } from '@angular/core';

@Injectable()
export class FormatOnRelation extends BaseRelation {
  public handleRelation(
    dependentComponent: CustomComponent | BaseModel<GenericAttrs>,
    reference: CustomComponentRef,
    componentVal: KeyValueMap,
    form: FormArray,
  ): void {
    const dependentControl = this.getControlById(dependentComponent.id, form);
    const newValue = {
      ...(dependentControl?.value?.value ?? {}),
      [reference.relatedRel]: { ...componentVal },
    };
    dependentControl.patchValue(
      { ...dependentControl?.value, value: newValue },
      { onlySelf: true, emitEvent: false },
    );

    this.afterHandleRelation(dependentComponent, form);
  }
}
