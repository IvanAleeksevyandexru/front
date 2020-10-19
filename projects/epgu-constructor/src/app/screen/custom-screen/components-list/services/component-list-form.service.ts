import { EventEmitter, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { LookupPartialProvider, LookupProvider } from 'epgu-lib/lib/models/dropdown.model';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pairwise, startWith, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { isEqualObj } from '../../../../shared/constants/uttils';
import {
  CustomComponent,
  CustomComponentOutputData,
  CustomListFormGroup,
  CustomListStatusElements, CustomScreenComponentTypes
} from '../../custom-screen.types';
import { ValidationService } from '../../services/validation.service';
import { AddressHelperService, DadataSuggestionsAddressForLookup } from '../address-helper.service';
import { ComponentListRepositoryService } from './component-list-repository.service';
import { ComponentListToolsService } from './component-list-tools.service';
import { ScenarioErrorsDto } from '../../../../services/api/form-player-api/form-player-api.types';

@Injectable()
export class ComponentListFormService {
  private _form = new FormArray([]);
  private _shownElements: CustomListStatusElements = {};
  private _changes = new EventEmitter<CustomComponentOutputData>();

  get shownElements(): CustomListStatusElements {
    return this._shownElements;
  }
  get form(): FormArray {
    return this._form;
  }
  get changes(): EventEmitter<CustomComponentOutputData> {
    return this._changes;
  }

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private unsubscribeService: UnsubscribeService,
    private toolsService: ComponentListToolsService,
    private addressHelperService: AddressHelperService,
    private repository: ComponentListRepositoryService,
  ) { }

  create(components: Array<CustomComponent>, errors: ScenarioErrorsDto): void {
    this.toolsService.createStatusElements(components, this.shownElements);

    this._form = new FormArray(
      components.map((component: CustomComponent) => this.createGroup(component, components, errors[component.id]))
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

    this.watchFormArray$().subscribe(() => this.emmitChanges());
    this.emmitChanges();
  }

  patch(component: CustomComponent): void {
    const control = this._form.controls.find(
      (ctrl) => ctrl.value.id === component.id,
    );
    const defaultIndex = component.attrs?.defaultIndex;
    // Если есть defaultIndex и не сохранненого ранее, то берем из справочника элемент по индексу defaultIndex
    if (defaultIndex !== undefined && !component.value) {
      const dicts = this.repository.dictionaries$.getValue();
      const key = component.attrs.dictionaryType + component.id;
      const value = dicts[key].list[defaultIndex];
      control.get('value').patchValue(value);
    } else {
      control.get('value').patchValue(this.toolsService.convertedValue(component));
    }
  }

  watchFormArray$(): Observable<Array<CustomListFormGroup>> {
    return this.form.valueChanges
      .pipe(
        distinctUntilChanged((prev, next) => isEqualObj<any>(prev, next)),
        takeUntil(this.unsubscribeService),
      );
  }

  async emmitChanges() {
    const components = this.form.getRawValue();
    for (const component of components) {
      if (component?.type === CustomScreenComponentTypes.CityInput && component?.value) {
        await this.addressHelperService.normalizeAddress(
          (component.value as unknown) as DadataSuggestionsAddressForLookup,
        );
      }
    }
    const prepareStateForSending = this.getPreparedStateForSending();

    console.log('emit', prepareStateForSending);
    this._changes.emit(prepareStateForSending);
  }

  addressHelperServiceProvider(): LookupProvider | LookupPartialProvider {
    return this.addressHelperService.provider;
  }

  private getPreparedStateForSending(): any {
    return Object.entries(this.form.getRawValue()).reduce((acc, [key, val]) => {
      const { disabled, valid } = this.form.get([key, 'value']);
      const { value } = val;
      const isValid = disabled || valid;

      if (this.shownElements[val.id]) {
        acc[val.id] = { value, isValid, disabled };
      }

      return acc;
    }, {});
  }

  private createGroup(component: CustomComponent, components: Array<CustomComponent>, errorMsg: string): FormGroup {
    const form: FormGroup =  this.fb.group({
      ...component,
      value: [
        this.toolsService.convertedValue(component),
        [this.validationService.customValidator(component),
        this.validationService.validationBackendError(errorMsg, component)],
      ],
    });

    this.watchFormGroup$(form).subscribe(([prev, next]: [CustomListFormGroup, CustomListFormGroup]) => {
      this._shownElements = this.toolsService.updateDependents(components, next, this.shownElements, this.form);
      ////////HARDCODE!!!
      if (next.attrs.dictionaryType === 'MARKI_TS' && !isEqualObj<CustomListFormGroup>(prev, next)) {
        const indexVehicle: number = this.form.controls.findIndex(
          (control: AbstractControl) => control.value?.id === next.id,
        );

        const options: any = {
          filter: {
            simple: {
              attributeName: 'Id_Mark',
              condition: 'EQUALS',
              value: {
                asString: `${this.form.get(String(indexVehicle)).value?.value?.id}`,
              },
            },
          },
        };

        const model: AbstractControl = this.form.controls.find(
          (control: AbstractControl) => control.value?.attrs?.dictionaryType === 'MODEL_TS',
        );

        model.get('value').patchValue('');

        this.repository
          .getDictionaries$('MODEL_TS', model?.value, options)
          .subscribe((dictionary) => {
            this.repository.initDictionary(dictionary);
        });
      }
      ///////////////////
    });

    return form;
  }

  private watchFormGroup$(form: FormGroup): Observable<Array<CustomListFormGroup>> {
    return form.valueChanges.pipe(
      startWith(form.getRawValue()),
      pairwise(),
      takeUntil(this.unsubscribeService),
    );
  }
}
