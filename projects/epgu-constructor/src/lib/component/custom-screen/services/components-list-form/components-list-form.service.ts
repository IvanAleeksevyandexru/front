import { EventEmitter, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { DatesToolsService, LoggerService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import {
  CustomComponent,
  CustomComponentAttr,
  CustomComponentAttrValidation,
  CustomComponentOutputData,
  CustomComponentValidationConditions,
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
import { DictionaryConditions } from '@epgu/epgu-constructor-types';
import { MaskTransformService } from '../../../../shared/services/mask-transform/mask-transform.service';
import { LookupPartialProvider, LookupProvider } from '@epgu/ui/models/dropdown';
import BaseModel from '../../component-list-resolver/BaseModel';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';
import DictionaryLikeModel from '../../component-list-resolver/DictionaryLikeModel';

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

  public create(components: CustomComponent[], componentsGroupIndex?: number): FormArray {
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
        return this.createGroup(component, components, componentsGroupIndex);
      }),
    );
    this.validationService.form = this.form;

    this.markForFirstRoundValidation(components);

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
        false,
        this.screenService,
        this.dictionaryToolsService,
        componentsGroupIndex,
      );
    });

    this.watchFormArray$()
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        tap(() => this.relationMapChanges(this.lastChangedComponent[1])),
      )
      .subscribe(() => this.emitChanges());
    this.emitChanges();

    return this._form;
  }

  public onAfterFilterOnRel(
    component: BaseModel<DictionarySharedAttrs>,
  ): void {
    component.value = this.componentsListToolsService.convertedValue(component) as string;
    this.componentsListRelationsService.onAfterFilterOnRel(
      component,
      this.form,
    );
  }

  public patch(component: BaseModel<DictionarySharedAttrs>): void {
    const control = this._form.controls.find((ctrl) => ctrl.value.id === component.id);
    const patched = component.patchControlValue && component.patchControlValue(control, this.screenService.getStore());
    if (!patched) {
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

  private markForFirstRoundValidation(components: CustomComponent[]): void {
    if (components.some((component: CustomComponent) => component.value)) {
      this._form.controls.forEach((control: FormControl) => {
        if (control.value.value) {
          control.markAsTouched();
        }
      });
    }
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
        } else if (type === CustomScreenComponentTypes.CalendarInput) {
          const keys = Object.keys(value);
          keys.forEach((key: string) => {
            value[key] = this.datesToolsService.format(value[key]);
          });
        } else if (
          type === CustomScreenComponentTypes.StringInput &&
          val.attrs.mask === 'NumberMaskInput' &&
          value
        ) {
          //при вводе любого числа, оно должно отправляться в нужном формате NumberMaskInput (EPGUCORE-59658)
          value = this.maskTransformService.transformNumberMaskInput(value, val.attrs.maskOptions);
        }
        acc[val.id] = { value, isValid, disabled, condition };
      }

      return acc;
    }, {});
  }

  private relationRegExp(value: string, params: RegExp): string[] {
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
    const validators = [this.validationService.customValidator(component)];
    if (
      component.type === CustomScreenComponentTypes.DateInput ||
      component.type === CustomScreenComponentTypes.MonthPicker ||
      component.type === CustomScreenComponentTypes.CalendarInput
    ) {
      validators.push(this.validationService.dateValidator(component, null));
    }
    control.setValidators(validators);
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
    components: CustomComponent[],
    componentsGroupIndex?: number,
  ): FormGroup {
    const validators = [this.validationService.customValidator(component)];

    if (
      component.type === CustomScreenComponentTypes.DateInput ||
      component.type === CustomScreenComponentTypes.MonthPicker ||
      component.type === CustomScreenComponentTypes.CalendarInput
    ) {
      validators.push(this.validationService.dateValidator(component, componentsGroupIndex));
    }

    const { type, attrs, id, label, required, arguments: _arguments } = component;

    const form: FormGroup = this.fb.group(
      {
        model: component,
        type,
        attrs,
        id,
        label,
        required,
        arguments: _arguments,
        value: [
          {
            value: this.componentsListToolsService.convertedValue(component),
            disabled: component.attrs?.disabled,
          },
          validators,
        ],
      },
      { updateOn: this.updateOnValidation() },
    );

    if (component.attrs?.hidden) {
      form.disable();
    }

    this.watchFormGroup$(form)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(([prev, next]: [CustomListFormGroup, CustomListFormGroup]) => {
        this.lastChangedComponent = [prev, next];
        if (!isEqual(prev, next)) {
          this._shownElements = this.componentsListRelationsService.getUpdatedShownElements(
            components,
            next,
            this.shownElements,
            this.form,
            true,
            this.screenService,
            this.dictionaryToolsService,
            componentsGroupIndex,
          );
          // TODO: в перспективе избавиться от этой хардкодной логики
          this.checkAndFetchCarModel(next);
        }
      });

    return form;
  }

  private checkAndFetchCarModel(next: CustomListFormGroup): void {
    if (next.attrs.dictionaryType === 'MARKI_TS') {
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

      const carModelControl: AbstractControl = this.form.controls.find(
        (control: AbstractControl) => control.value?.attrs?.dictionaryType === 'MODEL_TS',
      );

      carModelControl.get('value').patchValue('');

      // TODO: моделмодел
      const carModelModel: DictionaryLikeModel = carModelControl.value.model;
      carModelModel.loadReferenceData$(this.dictionaryToolsService
        .getDictionaries$('MODEL_TS', carModelModel, options)).subscribe();
    }
  }

  private watchFormGroup$(form: FormGroup): Observable<CustomListFormGroup[]> {
    return form.valueChanges.pipe(
      startWith(form.getRawValue() as unknown),
      pairwise(),
      takeUntil(this.ngUnsubscribe$),
    );
  }

  private watchFormArray$(): Observable<CustomListFormGroup[]> {
    return this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe$));
  }

  private updateOnValidation(): UpdateOn {
    return 'change';
  }
}
