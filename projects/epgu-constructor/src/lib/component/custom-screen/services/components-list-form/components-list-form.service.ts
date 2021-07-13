import { EventEmitter, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ListItem } from '@epgu/epgu-lib';
import { LookupPartialProvider, LookupProvider } from '@epgu/epgu-lib';
import { Observable } from 'rxjs';
import { pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { UtilsService as utils } from '@epgu/epgu-constructor-ui-kit';
import { isEqualObj } from '@epgu/epgu-constructor-ui-kit';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
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
} from '../../components-list.types';
import {
  AddressHelperService,
  DadataSuggestionsAddressForLookup,
} from '../../../../shared/services/address-helper/address-helper.service';
import { ComponentsListToolsService } from '../components-list-tools/components-list-tools.service';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { ComponentsListRelationsService } from '../components-list-relations/components-list-relations.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScenarioErrorsDto, DictionaryConditions } from '@epgu/epgu-constructor-types';
import { MaskTransformService } from '../../../../shared/directives/mask/mask-transform.service';

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
    private maskTransformService: MaskTransformService,
  ) {}

  public create(
    components: Array<CustomComponent>,
    errors: ScenarioErrorsDto,
    componentsGroupIndex?: number,
  ): FormArray {
    this.errors = errors;
    this._shownElements = this.componentsListRelationsService.createStatusElements(
      components,
      this.screenService.cachedAnswers,
    );

    this.indexesByIds = {};
    this.cachedAttrsComponents = {};
    this.lastChangedComponent = null;
    this._form = new FormArray(
      components.map((component: CustomComponent, index) => {
        this.indexesByIds[component.id] = index;
        return this.createGroup(
          component,
          components,
          errors && errors[component.id],
          componentsGroupIndex,
        );
      }),
    );
    this.validationService.form = this.form;
    // TODO: временно отключаю т.к. данная имплементация нежелательно аффектит обычные CUSTOM-формы без ошибок уникальности
    // Додумать механизм до выкатывания фичи в release/22
    // if (this.errors) {
    //   this._form.markAllAsTouched();
    // }

    components.forEach((component: CustomComponent) => {
      this.relationMapChanges(this.form.at(this.indexesByIds[component.id]).value);
      this._shownElements = this.componentsListRelationsService.getUpdatedShownElements(
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
        componentsGroupIndex,
      );
    });

    this.watchFormArray$()
      .pipe(tap(() => this.relationMapChanges(this.lastChangedComponent[1])))
      .subscribe(() => this.emitChanges());
    this.emitChanges();

    return this._form;
  }

  public onAfterFilterOnRel(component: CustomComponent): void {
    this.componentsListRelationsService.onAfterFilterOnRel(
      {
        ...component,
        value: this.componentsListToolsService.convertedValue(component),
      } as CustomComponent,
      this.form,
      this.dictionaryToolsService,
    );
  }

  public patch(component: CustomComponent): void {
    const control = this._form.controls.find((ctrl) => ctrl.value.id === component.id);
    const { defaultIndex = undefined, lookupDefaultValue = undefined } = component.attrs;
    const noValue = !component.value;
    const hasDefaultIndex = defaultIndex !== undefined;
    const hasDefaultValue = lookupDefaultValue !== undefined;
    const isDropdownLike = this.dictionaryToolsService.isDropdownLike(component.type);
    const isDictionaryLike = this.dictionaryToolsService.isDictionaryLike(component.type);
    const isDropDownDepts = component.type === CustomScreenComponentTypes.DropDownDepts;

    if (hasDefaultIndex && noValue && isDropdownLike) {
      this.patchDropDownLikeWithDefaultIndex(component, control, defaultIndex);
    } else if (hasDefaultIndex && isDropDownDepts) {
      // DropDownDepts has value as address
      this.patchDropDownDeptsValue(component, control, defaultIndex);
    } else if (hasDefaultIndex && noValue && !isDropdownLike) {
      this.patchDictionaryLikeWithDefaultIndex(component, control, defaultIndex);
    } else if (hasDefaultValue && noValue && isDictionaryLike) {
      this.patchDictionaryLikeWithDefaultValue(component, control, lookupDefaultValue);
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

  public addressHelperServiceProvider(
    attrs: CustomComponentAttr,
  ): LookupProvider | LookupPartialProvider {
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
        else if(type === CustomScreenComponentTypes.StringInput && val.attrs.mask === 'NumberMaskInput' && value) {
          //при вводе любого числа, оно должно отправляться в нужном формате NumberMaskInput (EPGUCORE-59658)
          value = this.maskTransformService.transformNumberMaskInput(value, val.attrs.maskOptions);
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

  private setRelationResult(component: CustomComponent, result?: Partial<CustomComponent>): void {
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
      this.relationPatch(component, result.attrs);
      this.cachedAttrsComponents[component.id].last = stringResult;
    }
  }

  private relationMapChanges(next: CustomListFormGroup): void {
    const value = next.value;
    if (!next.attrs?.relationField || !value) {
      return;
    }
    const { ref, conditions } = next.attrs?.relationField;
    const refComponent = this.form.getRawValue()[this.indexesByIds[ref]];

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
    componentsGroupIndex?: number,
  ): FormGroup {
    const validators = [
      this.validationService.customValidator(component),
      this.validationService.validationBackendError(errorMsg, component),
    ];

    if (
      component.type === CustomScreenComponentTypes.DateInput ||
      component.type === CustomScreenComponentTypes.MonthPicker
    ) {
      validators.push(this.validationService.dateValidator(component, componentsGroupIndex));
    }

    const { type, attrs, id, label, required } = component;

    const form: FormGroup = this.fb.group(
      {
        type,
        attrs,
        id,
        label,
        required,
        value: [
          {
            value: this.componentsListToolsService.convertedValue(component),
            disabled: component.attrs.disabled,
          },
          validators,
        ],
      },
      { updateOn: this.updateOnValidation() },
    );

    if (component.attrs?.hidden) {
      form.disable();
    }

    this.watchFormGroup$(form).subscribe(
      ([prev, next]: [CustomListFormGroup, CustomListFormGroup]) => {
        this.lastChangedComponent = [prev, next];
        this._shownElements = this.componentsListRelationsService.getUpdatedShownElements(
          components,
          next,
          this.shownElements,
          this.form,
          this.dictionaryToolsService.dictionaries,
          true,
          this.screenService,
          this.dictionaryToolsService,
          componentsGroupIndex,
        );
        // TODO: в перспективе избавиться от этой хардкодной логики
        this.checkAndFetchCarModel(next, prev);
      },
    );

    return form;
  }

  private checkAndFetchCarModel(next: CustomListFormGroup, prev: CustomListFormGroup): void {
    if (next.attrs.dictionaryType === 'MARKI_TS' && !isEqualObj<CustomListFormGroup>(prev, next)) {
      const indexVehicle: number = this.form.controls.findIndex(
        (control: AbstractControl) => control.value?.id === next.id,
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
        (control: AbstractControl) => control.value?.attrs?.dictionaryType === 'MODEL_TS',
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
      startWith(form.getRawValue() as unknown),
      pairwise(),
      takeUntil(this.ngUnsubscribe$),
    );
  }

  private watchFormArray$(): Observable<Array<CustomListFormGroup>> {
    return this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe$));
  }

  private updateOnValidation(): UpdateOn {
    return 'change';
  }

  private patchDropDownLikeWithDefaultIndex(
    component: CustomComponent,
    control: AbstractControl,
    defaultIndex: number,
  ): void {
    const dicts: CustomListDropDowns = this.dictionaryToolsService.dropDowns$.getValue();
    const key: string = component.id;
    const value: ListItem = dicts[key] && dicts[key][defaultIndex];

    control.get('value').patchValue(value);
  }

  private patchDictionaryLikeWithDefaultIndex(
    component: CustomComponent,
    control: AbstractControl,
    defaultIndex: number,
  ): void {
    const dicts: CustomListDictionaries = this.dictionaryToolsService.dictionaries;
    const key: string = utils.getDictKeyByComp(component);
    const value: ListItem = dicts[key]?.list[defaultIndex];

    control.get('value').patchValue(value);
  }

  private patchDropDownDeptsValue(
    component: CustomComponent,
    control: AbstractControl,
    defaultIndex: number,
  ): void {
    const lockedValue = component.attrs?.lockedValue;
    const dicts: CustomListDictionaries = this.dictionaryToolsService.dictionaries;
    const key: string = utils.getDictKeyByComp(component);
    const repeatedWithNoFilters = dicts[key]?.repeatedWithNoFilters;

    if (lockedValue && !repeatedWithNoFilters || dicts[key]?.list?.length === 1) {
      const value: ListItem = dicts[key]?.list[defaultIndex];
      control.get('value').patchValue(value);
    }
  }

  private patchDictionaryLikeWithDefaultValue(
    component: CustomComponent,
    control: AbstractControl,
    defaultValue: string | number,
  ): void {
    const dicts: CustomListDictionaries = this.dictionaryToolsService.dictionaries;
    const key: string = utils.getDictKeyByComp(component);
    const value: ListItem = dicts[key]?.list.find(({ id }) => id === defaultValue);

    if (value) {
      control.get('value').patchValue(value);
    }
  }
}
