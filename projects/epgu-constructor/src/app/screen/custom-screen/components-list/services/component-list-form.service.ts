import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  CustomComponent,
  CustomListFormGroup,
  CustomListStatusElements
} from '../../custom-screen.types';
import { ValidationService } from '../../services/validation.service';
import { pairwise, startWith, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { Observable } from 'rxjs';
import { ComponentListToolsService } from './component-list-tools.service';

@Injectable()
export class ComponentListFormService {
  private _form = new FormArray([]);
  private _shownElements: CustomListStatusElements = {};

  get shownElements(): CustomListStatusElements {
    return this._shownElements;
  }
  get form(): FormArray {
    return this._form;
  }

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private unsubscribeService: UnsubscribeService,
    private toolsService: ComponentListToolsService,
  ) { }

  create(components: Array<CustomComponent>): void {
    this.toolsService.createStatusElements(components, this.shownElements);

    this._form = new FormArray(
      components.map((component: CustomComponent) => this.createGroup(component, components))
    );

    components.forEach((component: CustomComponent) => {
      this._shownElements = this.toolsService.updateDependents(
        components,
        {
          ...component,
          value: this.toolsService.convertedValue(component)
        },
        this.shownElements,
        this.form
      );
    });
  }

  private createGroup(component: CustomComponent, components: Array<CustomComponent>): FormGroup {
    const form: FormGroup =  this.fb.group({
      ...component,
      value: [
        this.toolsService.convertedValue(component),
        this.validationService.customValidator(component)],
    });

    this.watch$(form).subscribe(([prev, next]) => {
      this._shownElements = this.toolsService.updateDependents(components, next, this.shownElements, this.form);
    });

    return form;
  }

  private watch$(form: FormGroup): Observable<Array<CustomListFormGroup>> {
    return form.valueChanges.pipe(
      startWith(form.getRawValue()),
      pairwise(),
      takeUntil(this.unsubscribeService),
    );
  }
}
