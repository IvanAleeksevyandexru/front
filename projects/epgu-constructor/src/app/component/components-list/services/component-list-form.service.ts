import { EventEmitter, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ListItem } from 'epgu-lib';
import { LookupPartialProvider, LookupProvider } from 'epgu-lib/lib/models/dropdown.model';
import * as moment_ from 'moment';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { ScenarioErrorsDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { isEqualObj } from '../../../shared/constants/uttils';
import { UtilsService as utils } from '../../../shared/services/utils/utils.service';
import {
  CustomComponent,
  CustomComponentAttrValidation,
  CustomComponentOutputData,
  CustomComponentValidationConditions,
  CustomListDictionaries,
  CustomListDropDowns,
  CustomListFormGroup,
  CustomListStatusElements,
  CustomScreenComponentTypes,
  CustomComponentAttr,
  UpdateOn,
} from '../components-list.types';
import { isDropDown } from '../tools/custom-screen-tools';
import { AddressHelperService, DadataSuggestionsAddressForLookup } from './address-helper.service';
import { ComponentListRepositoryService } from './component-list-repository.service';
import { ComponentListToolsService } from './component-list-tools.service';
import { ValidationService } from './validation.service';
import { DATE_STRING_DOT_FORMAT } from '../../../shared/constants/dates';
import { LoggerService } from '../../../core/services/logger/logger.service';

const moment = moment_;

@Injectable()
export class ComponentListFormService {
  private _form = new FormArray([]);
  private _shownElements: CustomListStatusElements = {};
  private _changes = new EventEmitter<CustomComponentOutputData>();
  private mapRelationTypes = {
    RegExp: this.relationRegExp.bind(this),
    MinDate: this.relationMinDate.bind(this),
    MaxDate: this.relationMaxDate.bind(this),
  };
  private indexesByIds: Record<string, number> = {};
  private cachedAttrsComponents: Record<string, { base: CustomComponentAttr; last: string }> = {};
  private lastChangedComponent: [CustomListFormGroup, CustomListFormGroup];
  private errors: ScenarioErrorsDto;

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
    private logger: LoggerService,
  ) {}

  create(components: Array<CustomComponent>, errors: ScenarioErrorsDto): void {
    this.errors = errors;
    this.toolsService.createStatusElements(components, this.shownElements);

    this.indexesByIds = {};
    this.cachedAttrsComponents = {};
    this.lastChangedComponent = null;
    this._form = new FormArray(
      components.map((component: CustomComponent, index) => {
        this.indexesByIds[component.id] = index;
        return this.createGroup(component, components, errors[component.id]);
      }),
    );

    components.forEach((component: CustomComponent) => {
      this.relationMapChanges(this.form.at(this.indexesByIds[component.id]).value);
      this._shownElements = this.toolsService.updateDependents(
        components,
        {
          ...component,
          value: this.toolsService.convertedValue(component),
        },
        this.shownElements,
        this.form,
      );
    });

    this.watchFormArray$()
      .pipe(tap(() => this.relationMapChanges(this.lastChangedComponent[1])))
      .subscribe(() => this.emmitChanges());
    this.emmitChanges();
  }

  patch(component: CustomComponent): void {
    const control = this._form.controls.find((ctrl) => ctrl.value.id === component.id);
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
    return this.form.valueChanges.pipe(
      distinctUntilChanged((prev, next) =>
        isEqualObj<boolean | number | string | object>(prev, next),
      ),
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

  private getPreparedStateForSending(): CustomComponentOutputData {
    return Object.entries(this.form.getRawValue()).reduce((acc, [key, val]) => {
      const { disabled, valid } = this.form.get([key, 'value']);
      const isLeastOneCondition: boolean = this.form
        .get([key, 'attrs'])
        .value.validation?.some(
          (validation: CustomComponentAttrValidation) =>
            validation.condition === CustomComponentValidationConditions.atLeastOne,
        );
      const condition: CustomComponentValidationConditions | null = isLeastOneCondition
        ? CustomComponentValidationConditions.atLeastOne
        : null;
      let { value, type } = val;
      const isValid = disabled || valid;

      if (this.shownElements[val.id].isShown) {
        if (type === CustomScreenComponentTypes.DateInput) {
          value = moment(value).toISOString(true); // NOTICE: обработка даты и "правильное" приведение к ISO-строке
        }
        acc[val.id] = { value, isValid, disabled, condition };
      }

      return acc;
    }, {});
  }

  private relationRegExp(value: string, params: RegExp) {
    return String(value).match(params);
  }
  private relationMinDate(value: string, params: string) {
    return moment(value).isSameOrAfter(moment(params, DATE_STRING_DOT_FORMAT));
  }
  private relationMaxDate(value: string, params: string) {
    return moment(value).isSameOrBefore(moment(params, DATE_STRING_DOT_FORMAT));
  }

  private changeValidators(component: CustomComponent, control: AbstractControl) {
    control.setValidators([
      this.validationService.customValidator(component),
      this.validationService.validationBackendError(this.errors[component.id], component),
    ]);
  }

  private relationPatch(component: CustomComponent, patch: object) {
    const resultComponent = { ...component, attrs: { ...component.attrs, ...patch }};

    const control = this.form.controls[this.indexesByIds[component.id]] as FormGroup;

    control.patchValue(
      {
        attrs: { ...component.attrs, ...patch },
      },
      { onlySelf: true, emitEvent: false },
    );
    this.changeValidators(resultComponent, control.controls.value);
    control.get('value').updateValueAndValidity();
  }

  private resetRelation(component: CustomComponent) {
    return this.relationPatch(component, this.cachedAttrsComponents[component.id].base);
  }

  private setRelationResult(component: CustomComponent, result?: CustomComponentAttr) {
    if (!result) {
      if (this.cachedAttrsComponents[component.id]) {
        this.resetRelation(component);
      }
      return;
    }
    if (!this.cachedAttrsComponents[component.id]) {
      this.cachedAttrsComponents[component.id] = { base: component.attrs, last: '' };
    }

    const stringResult = JSON.stringify(result);
    if (this.cachedAttrsComponents[component.id].last !== stringResult) {
      component.attrs = this.cachedAttrsComponents[component.id].base;
      this.relationPatch(component, result.attrs); // TODO: выглядит так что возможно ошибка т.к. есть атрибут refsAttrs
      this.cachedAttrsComponents[component.id].last = stringResult;
    }
  }

  private relationMapChanges(next: CustomListFormGroup) {
    const value = next.value;
    if (!next.attrs?.relationField || !value) {
      return;
    }
    const { ref, conditions } = next.attrs?.relationField;
    const refComponent = this.form.value[this.indexesByIds[ref]];

    let result;
    for (let condition of conditions) {
      const func = this.mapRelationTypes[condition.type];
      if (!func) {
        this.logger.error(
          [`Relation condition type: ${condition.type} - not found.`],
          'relationComponent',
        );
        return;
      }
      if (func(value, condition.value)) {
        this.logger.log(
          [`condition.type used: ${condition.type}, ${value}, ${condition.value}`],
          'relationComponent',
        );
        result = condition.result;
        break;
      }
    }

    this.setRelationResult(refComponent, result);
  }

  private createGroup(
    component: CustomComponent,
    components: Array<CustomComponent>,
    errorMsg: string,
  ): FormGroup {
    const form: FormGroup = this.fb.group(
      {
        ...component,
        value: [
          { value: this.toolsService.convertedValue(component), disabled: component.attrs.disabled },
          [
            this.validationService.customValidator(component),
            this.validationService.validationBackendError(errorMsg, component),
          ],
        ],
      },
      { updateOn: this.updateOnValidation(component) },
    );

    if (component.attrs?.hidden) {
      form.disable();
    }

    this.watchFormGroup$(form).subscribe(
      ([prev, next]: [CustomListFormGroup, CustomListFormGroup]) => {
        this.lastChangedComponent = [prev, next];
        this._shownElements = this.toolsService.updateDependents(
          components,
          next,
          this.shownElements,
          this.form,
        );
        ////////HARDCODE!!!
        if (
          next.attrs.dictionaryType === 'MARKI_TS' &&
          !isEqualObj<CustomListFormGroup>(prev, next)
        ) {
          const indexVehicle: number = this.form.controls.findIndex(
            (control: AbstractControl) => control.value?.id === next.id,
          );

          const options = {
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
      },
    );

    return form;
  }

  private watchFormGroup$(form: FormGroup): Observable<Array<CustomListFormGroup>> {
    return form.valueChanges.pipe(
      startWith(form.getRawValue()),
      pairwise(),
      takeUntil(this.unsubscribeService),
    );
  }

  private updateOnValidation(component: CustomComponent): UpdateOn {
    return component.attrs?.updateOnValidation || 'change';
  }
}
