import { EventEmitter, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { LookupPartialProvider, LookupProvider } from 'epgu-lib/lib/models/dropdown.model';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pairwise, startWith, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { isEqualObj } from '../../../shared/constants/uttils';
import {
  CustomComponent,
  CustomComponentOutputData, CustomListDictionaries, CustomListDropDowns,
  CustomListFormGroup,
  CustomListStatusElements, CustomScreenComponentTypes
} from '../components-list.types';
import { ValidationService } from './validation.service';
import { AddressHelperService, DadataSuggestionsAddressForLookup } from './address-helper.service';
import { ComponentListRepositoryService } from './component-list-repository.service';
import { ComponentListToolsService } from './component-list-tools.service';
import { ScenarioErrorsDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { UtilsService as utils } from '../../../shared/services/utils/utils.service';
import { isDropDown } from '../tools/custom-screen-tools';
import { ListItem } from 'epgu-lib';
import * as moment_ from 'moment';

const moment = moment_;

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
    // Если есть defaultIndex и нет сохранненого ранее значения, то берем из справочника элемент по индексу defaultIndex
    if (defaultIndex !== undefined && !component.value) {
      if (isDropDown(component.type)) {
        const dicts: CustomListDropDowns = this.repository.dropDowns$.getValue();
        const key: string = component.id;
        const value: ListItem = dicts[key][defaultIndex];
        control.get('value').patchValue(value);
      } else {
        const dicts: CustomListDictionaries = this.repository.dictionaries;
        const key: string = utils.getDictKeyByComp(component);
        const value: ListItem = dicts[key].list[defaultIndex];
        control.get('value').patchValue(value);
      }
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
      let { value, type } = val;
      const isValid = disabled || valid;

      if (this.shownElements[val.id]) {
        if (type === CustomScreenComponentTypes.DateInput) {
          value = moment(value).toISOString(true); // NOTICE: обработка даты и "правильное" приведение к ISO-строке
        }
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

    if (component.attrs?.hidden) {
      form.disable();
    }

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
