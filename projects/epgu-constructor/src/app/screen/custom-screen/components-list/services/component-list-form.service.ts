import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CustomComponent, CustomComponentAttr, CustomScreenComponentTypes } from '../../custom-screen.types';
import { ValidationService } from '../../services/validation.service';
import { isBoolean, isEqual, isUndefined } from '../../../../shared/constants/uttils';
import { pairwise, startWith, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { Observable } from 'rxjs';

interface FormGroupModel {
  attrs: CustomComponentAttr;
  id: string;
  label: string;
  required: boolean;
  type: CustomScreenComponentTypes;
  value: any;
}

interface StatusElements {
  [key: string]: boolean;
}

enum Relation {
  displayOn = 'displayOn',
  disabled = 'disabled',
}

@Injectable()
export class ComponentListFormService {
  private _form = new FormArray([]);

  shownElements: StatusElements = {};
  disabledElements: StatusElements = {};

  get form() {
    return this._form;
  }

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private unsubscribeService: UnsubscribeService,
  ) { }

  create(components: Array<CustomComponent>): void {
    this.createStatusElements(components);
    this._form = new FormArray(
      components.map((component: CustomComponent) => this.createGroup(component, components))
    );
  }

  private createStatusElements(components: Array<CustomComponent>): void {
    components.forEach((component: CustomComponent) => {
      this.shownElements[component.id] = !this.hasRelation(component, Relation.displayOn);
      this.disabledElements[component.id] = this.hasRelation(component, Relation.disabled);
    });
  }

  private updateStatusElements(
    elementId: string,
    relation: Relation,
    referenceVal: any,
    componentVal: any): void {

    const isEqualValue = isEqual<any>(referenceVal, componentVal);

    if (relation === Relation.displayOn) {
      this.shownElements[elementId] = isEqualValue;
    }

    if (relation === Relation.disabled) {
      this.disabledElements[elementId] = isEqualValue;
    }

    console.log(elementId, relation, referenceVal, componentVal);
  }

  private hasRelation(component: CustomComponent,relation: Relation): boolean {
    return component.attrs?.ref?.some((o: any) => o.relation === relation);
  }

  private updateDependents(components: Array<CustomComponent>, component: FormGroupModel | CustomComponent): void {
    const isComponentDependent = (arr = []): boolean =>
      arr?.some((el) => el.relatedRel === component.id);

    const getDependentComponents = (components): Array<CustomComponent> =>
      components.filter((c: CustomComponent) => isComponentDependent(c.attrs?.ref));

    getDependentComponents(components).forEach((element: CustomComponent) => {
      const reference = element.attrs?.ref?.find(
        (c) => c.relatedRel === component.id
      );

      if (reference) {
        this.updateStatusElements(element.id, reference.relation, reference.val, component.value);
      }
    });

  }

  private createGroup(component: CustomComponent, components: Array<CustomComponent>): FormGroup {
    const form: FormGroup =  this.fb.group({
      ...component,
      value: [
        this.convertedValue(component),
        this.validationService.customValidator(component)
      ],
    });

    this.updateDependents(components, { ...component, value: this.convertedValue(component) });

    this.watch$(form).subscribe(([prev, next]) => {
      this.updateDependents(components, next);
    });

    return form;
  }

  private watch$(form: FormGroup): Observable<Array<FormGroupModel>> {
    return form.valueChanges.pipe(
      startWith(form.getRawValue()),
      pairwise(),
      takeUntil(this.unsubscribeService),
    );
  }

  private convertedValue(component: CustomComponent) {
    if (String(component.value)) {
      if (component.type === CustomScreenComponentTypes.DateInput && component.value) {
        return new Date(component.value);
      } else {
        return component.value;
      }
    } else if (!isUndefined(component.attrs?.defaultValue)) {
      return component.attrs?.defaultValue;
    }
  }
}
