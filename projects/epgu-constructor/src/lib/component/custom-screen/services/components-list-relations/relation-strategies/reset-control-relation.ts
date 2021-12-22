import { BaseRelation } from './base-relation';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { CustomComponent, CustomComponentRef } from '../../../components-list.types';
import { FormArray } from '@angular/forms';
import BaseModel from '../../../component-list-resolver/BaseModel';
import GenericAttrs from '../../../component-list-resolver/GenericAttrs';
import { Injectable } from '@angular/core';

@Injectable()
export class ResetControlRelation extends BaseRelation {
  public handleRelation(
    dependentComponent: CustomComponent | BaseModel<GenericAttrs>,
    reference: CustomComponentRef,
    _componentVal: KeyValueMap,
    form: FormArray,
  ): void {
    const dependentControl = this.getControlById(dependentComponent.id, form);
    this.handleResetControl(dependentControl, form, reference);

    this.afterHandleRelation(dependentComponent, form);
  }
}
