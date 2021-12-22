import { CustomComponent, CustomComponentRef } from '../../../components-list.types';
import { AbstractControl, FormArray } from '@angular/forms';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import BaseModel from '../../../component-list-resolver/BaseModel';
import GenericAttrs from '../../../component-list-resolver/GenericAttrs';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { JsonHelperService } from '@epgu/epgu-constructor-ui-kit';
import { Injectable, Injector } from '@angular/core';

@Injectable()
export abstract class BaseRelation {
  protected prevValues: KeyValueMap = {};

  protected refRelationService: RefRelationService;

  protected jsonHelperService: JsonHelperService;

  public constructor(protected injector: Injector) {
    this.refRelationService = this.injector.get(RefRelationService);
    this.jsonHelperService = this.injector.get(JsonHelperService);
  }

  protected afterHandleRelation(dependentComponent: CustomComponent, form: FormArray): void {
    const dependentControl = this.getControlById(dependentComponent.id, form);

    const isDependentDisabled: boolean = dependentComponent.attrs.disabled;
    if (isDependentDisabled) {
      dependentControl.disable();
    }
  }

  protected handleResetControl(
    dependentControl: AbstractControl,
    form: FormArray,
    reference: CustomComponentRef,
  ): void {
    const { value } = this.getControlById(reference.relatedRel, form);
    const controlValue = value.value?.id || value.value;
    if (
      !this.refRelationService.isValueEquals(
        controlValue,
        (reference.val as string) || this.prevValues[value.id],
      )
    ) {
      dependentControl.get('value').reset();
    }
    this.prevValues[value.id] = controlValue;
  }

  protected getRelation(
    component: CustomComponent,
    reference: CustomComponentRef,
  ): CustomComponentRef {
    return component.attrs.ref?.find(({ relation }) => relation === reference.relation);
  }

  protected hasControlWithIdOnForm(id: string, form: FormArray): boolean {
    return !!this.getControlById(id, form);
  }

  protected getControlValueById(id: string, form: FormArray): { id?: string } | string | number {
    return this.getControlById(id, form).get('value').value;
  }

  protected getControlById(id: string, form: FormArray): AbstractControl {
    return form.controls.find((control: AbstractControl) => control.value.id === id);
  }

  protected getRefValue(value: string | unknown): unknown {
    const isParsable = this.jsonHelperService.hasJsonStructure(value as string);
    return isParsable ? JSON.parse(value as string) : value;
  }

  public abstract handleRelation(
    dependentComponent: CustomComponent | BaseModel<GenericAttrs>,
    reference: CustomComponentRef,
    componentVal: KeyValueMap | '',
    form: FormArray,
    components: (CustomComponent | BaseModel<GenericAttrs>)[],
    initInitialValues: boolean,
  ): void;
}
