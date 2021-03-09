import { EventEmitter, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ListItem } from 'epgu-lib';
import { LookupPartialProvider, LookupProvider } from 'epgu-lib/lib/models/dropdown.model';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { UtilsService as utils } from '../../../core/services/utils/utils.service';
import { ScenarioErrorsDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { isEqualObj } from '../../constants/uttils';
import { ValidationService } from '../validation/validation.service';
import { DictionaryConditions } from '../dictionary/dictionary-api.types';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';
import {
  CustomComponent,
  CustomComponentAttr,
  CustomComponentAttrValidation,
  CustomComponentOutputData,
  CustomComponentValidationConditions,
  CustomListDictionaries,
  CustomListDropDowns,
  CustomListFormGroup,
  CustomListStatusElements,
  CustomScreenComponentTypes,
  UpdateOn,
} from '../../components/components-list/components-list.types';
import {
  AddressHelperService,
  DadataSuggestionsAddressForLookup,
} from '../address-helper/address-helper.service';
import { ComponentsListToolsService } from '../components-list-tools/components-list-tools.service';
import { DateRangeService } from '../date-range/date-range.service';
import { ComponentsListRelationsService } from '../components-list-relations/components-list-relations.service';
import { ScreenService } from '../../../screen/screen.service';

@Injectable()
export class ComponentsListFormService {
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
    private ngUnsubscribe$: UnsubscribeService,
    private componentsListToolsService: ComponentsListToolsService,
    private componentsListRelationsService: ComponentsListRelationsService,
    private addressHelperService: AddressHelperService,
    private logger: LoggerService,
    private datesToolsService: DatesToolsService,
    private datesRangeService: DateRangeService,
    private dictionaryToolsService: DictionaryToolsService,
    private screenService: ScreenService,
  ) {}

  public create(components: Array<CustomComponent>, errors: ScenarioErrorsDto): void {
    this.errors = errors;
    this.componentsListRelationsService.createStatusElements(components, this.shownElements);

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
      this._shownElements = this.componentsListRelationsService.updateDependents(
        components,
        {
          ...component,
          value: this.componentsListToolsService.convertedValue(component),
        } as CustomComponent,
        this.shownElements,
        this.form,
        this.dictionaryToolsService.dictionaries,
        false,
        this.screenService,
        this.dictionaryToolsService,
      );
    });

    this.watchFormArray$()
      .pipe(tap(() => this.relationMapChanges(this.lastChangedComponent[1])))
      .subscribe(() => this.emitChanges());
    this.emitChanges();
  }

  public patch(component: CustomComponent): void {
    const control = this._form.controls.find((ctrl) => ctrl.value.id === component.id);
    const defaultIndex = component.attrs?.defaultIndex;
    // Если есть defaultIndex и нет сохранненого ранее значения, то берем из справочника элемент по индексу defaultIndex
    if (defaultIndex !== undefined && !component.value) {
      if (this.dictionaryToolsService.isDropdownLike(component.type)) {
        const dicts: CustomListDropDowns = this.dictionaryToolsService.dropDowns$.getValue();
        const key: string = component.id;
        const value: ListItem = dicts[key][defaultIndex];
        control.get('value').patchValue(value);
      } else {
        const dicts: CustomListDictionaries = this.dictionaryToolsService.dictionaries;
        const key: string = utils.getDictKeyByComp(component);
        const value: ListItem = dicts[key].list[defaultIndex];
        control.get('value').patchValue(value);
      }
    } else {
      control.get('value').patchValue(this.componentsListToolsService.convertedValue(component));
    }
  }

  public async emitChanges(): Promise<void> {
    const components = this.form.getRawValue();
    for (const component of components) {
      if (component?.type === CustomScreenComponentTypes.CityInput && component?.value) {
        await this.addressHelperService.normalizeAddress(
          (component.value as unknown) as DadataSuggestionsAddressForLookup,
        );
      }
    }
    const prepareStateForSending = this.getPreparedStateForSending();

    this._changes.emit(prepareStateForSending);
  }

  public addressHelperServiceProvider(attrs: CustomComponentAttr): LookupProvider | LookupPartialProvider {
    return this.addressHelperService.getProvider(attrs.searchType, attrs.cityFilter);
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
        if (type === CustomScreenComponentTypes.DateInput && value) {
          value = this.datesToolsService.format(value);
        }
        acc[val.id] = { value, isValid, disabled, condition };
      }

      return acc;
    }, {});
  }

  private relationRegExp(value: string, params: RegExp): Array<string> {
    return String(value).match(params);
  }
  private relationMinDate(value: string | Date, params: string): boolean {
    const { dateLeft, dateRight } = this.datesRangeService.parsedDates(value, params);
    return this.datesToolsService.isSameOrAfter(dateLeft, dateRight);
  }
  private relationMaxDate(value: string | Date, params: string): boolean {
    const { dateLeft, dateRight } = this.datesRangeService.parsedDates(value, params);
    return this.datesToolsService.isSameOrBefore(dateLeft, dateRight);
  }

  private changeValidators(component: CustomComponent, control: AbstractControl): void {
    control.setValidators([
      this.validationService.customValidator(component),
      this.validationService.validationBackendError(this.errors[component.id], component),
    ]);
  }

  private relationPatch(component: CustomComponent, patch: object): void {
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

  private resetRelation(component: CustomComponent): void {
    return this.relationPatch(component, this.cachedAttrsComponents[component.id].base);
  }

  private setRelationResult(component: CustomComponent, result?: CustomComponentAttr): void {
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

  private relationMapChanges(next: CustomListFormGroup): void {
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
    const validators = [
      this.validationService.customValidator(component),
      this.validationService.validationBackendError(errorMsg, component),
    ];

    if (component.type === CustomScreenComponentTypes.DateInput) {
      validators.push(this.validationService.dateValidator(component));
    }

    const form: FormGroup = this.fb.group(
      {
        ...component,
        value: [
          {
            value: this.componentsListToolsService.convertedValue(component),
            disabled: component.attrs.disabled,
          },
          validators,
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
        this._shownElements = this.componentsListRelationsService.updateDependents(
          components,
          next,
          this.shownElements,
          this.form,
          this.dictionaryToolsService.dictionaries,
          true,
          this.screenService,
          this.dictionaryToolsService,
        );
        // TODO: в перспективе избавиться от этой хардкодной логики
        this.checkAndFetchCarModel(next, prev);
      },
    );

    return form;
  }

  private checkAndFetchCarModel(next: CustomListFormGroup, prev: CustomListFormGroup): void {
    if (next.attrs.dictionaryType === 'MARKI_TS' &&
      !isEqualObj<CustomListFormGroup>(prev, next)) {
      const indexVehicle: number = this.form.controls.findIndex(
        (control: AbstractControl) => control.value?.id === next.id
      );

      const options = {
        filter: {
          simple: {
            attributeName: 'Id_Mark',
            condition: DictionaryConditions.EQUALS,
            value: {
              asString: `${this.form.get(String(indexVehicle)).value?.value?.id}`,
            },
          },
        },
      };

      const model: AbstractControl = this.form.controls.find(
        (control: AbstractControl) => control.value?.attrs?.dictionaryType === 'MODEL_TS'
      );

      model.get('value').patchValue('');

      this.dictionaryToolsService
        .getDictionaries$('MODEL_TS', model?.value, options)
        .subscribe((dictionary) => {
          this.dictionaryToolsService.initDictionary(dictionary);
        });
    }
  }

  private watchFormGroup$(form: FormGroup): Observable<Array<CustomListFormGroup>> {
    return form.valueChanges.pipe(
      startWith(form.getRawValue()), // TODO: заменить устаревший метод
      pairwise(),
      takeUntil(this.ngUnsubscribe$),
    );
  }

  private watchFormArray$(): Observable<Array<CustomListFormGroup>> {
    return this.form.valueChanges.pipe(
      distinctUntilChanged((prev, next) =>
        isEqualObj<boolean | number | string | object>(prev, next),
      ),
      takeUntil(this.ngUnsubscribe$),
    );
  }

  private updateOnValidation(component: CustomComponent): UpdateOn {
    return component.attrs?.updateOnValidation || 'change';
  }
}
