import { CustomComponent, CustomComponentRef, CustomListStatusElements } from '../../../components-list.types';
import { AbstractControl, FormArray } from '@angular/forms';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { DictionaryToolsService } from '../../../../../shared/services/dictionary/dictionary-tools.service';
import { ScreenService } from '../../../../../screen/screen.service';

export abstract class BaseRelation {
  protected prevValues: KeyValueMap = {};

  public constructor(protected refRelationService: RefRelationService) {}

  protected afterHandleRelation(
    shownElements: CustomListStatusElements,
    dependentComponent: CustomComponent,
    form: FormArray,
  ): CustomListStatusElements {
    const dependentControl: AbstractControl = form.controls.find(
      (control: AbstractControl) => control.value.id === dependentComponent.id,
    );

    const isDependentDisabled: boolean = dependentComponent.attrs.disabled;
    if (isDependentDisabled) {
      dependentControl.disable();
    }

    return shownElements;
  }

  protected hasControlWithIdOnForm(id: string, form: FormArray): boolean {
    return !!form.controls.find((control) => control.value.id === id);
  }

  protected getControlValueById(id: string, form: FormArray): { id?: string } | string | number {
    return form.controls.find((control) => control.value.id === id).get('value').value;
  }

  protected handleResetControl(
    dependentControl: AbstractControl,
    form: FormArray,
    reference: CustomComponentRef,
  ): void {
    const { value } = form.controls.find((control) => control.value.id === reference.relatedRel);
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

  public abstract handleRelation(
    shownElements: CustomListStatusElements,
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: KeyValueMap | '',
    form: FormArray,
    components: CustomComponent[],
    initInitialValues: boolean,
    dictionaryToolsService: DictionaryToolsService,
    screenService: ScreenService,
  ): CustomListStatusElements;
}
