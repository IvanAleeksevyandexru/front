import { EventEmitter, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { isEqual } from 'lodash';

import {
  DatesToolsService,
  LoggerService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { ComponentRelationFieldDto, RelationCondition } from '@epgu/epgu-constructor-types';
import { LookupPartialProvider, LookupProvider } from '@epgu/ui/models/dropdown';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import {
  CustomComponent,
  CustomComponentAttr,
  CustomComponentAttrValidation,
  CustomComponentOutputData,
  CustomComponentValidationConditions,
  CustomListFormGroup,
  CustomListStatusElements,
  CustomScreenComponentTypes,
  Fields,
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
import { MaskTransformService } from '../../../../shared/services/mask-transform/mask-transform.service';
import BaseModel from '../../component-list-resolver/BaseModel';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';
import { MaritalStatusInputField } from '../../components/marital-status-input/marital-status-input.types';

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
    private screenService: ScreenService,
    private maskTransformService: MaskTransformService,
  ) {}

  public create(components: CustomComponent[], componentsGroupIndex?: number): FormArray {
    this._shownElements = this.componentsListRelationsService.calculateVisibility(
      components,
      this.screenService.cachedAnswers,
      this.form,
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
      this._shownElements = this.componentsListRelationsService.processRelations(
        components,
        {
          ...component,
          value: this.componentsListToolsService.convertedValue(component),
        } as CustomComponent,
        this.shownElements,
        this.form,
        false,
        this.screenService,
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

  public patch(component: BaseModel<DictionarySharedAttrs>): void {
    const control = this._form.controls.find((ctrl) => ctrl.value.id === component.id);
    const patched =
      component.patchControlValue &&
      component.patchControlValue(control, this.screenService.getStore());
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

  public relationMapChanges(
    next: CustomListFormGroup | Fields,
    relationField?: ComponentRelationFieldDto,
    relationValue?: unknown,
    refControl?: AbstractControl,
    refComponent?: Fields,
  ): void {
    if (!relationField) {
      const { value } = next;
      if (!next.attrs?.relationField || !value) {
        return;
      }
      const { ref, conditions } = next.attrs?.relationField;
      const refComponentForm = this.form.getRawValue()[this.indexesByIds[ref]];
      this.updateRelationMap(conditions, value, refComponentForm);
    } else {
      const { conditions } = relationField;

      this.updateRelationMap(conditions, relationValue, refComponent, refControl);
    }
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
          keys.forEach((prop: string) => {
            value[prop] = this.datesToolsService.format(value[prop]);
          });
        } else if (
          type === CustomScreenComponentTypes.StringInput &&
          val.attrs.mask === 'NumberMaskInput' &&
          value
        ) {
          // при вводе любого числа, оно должно отправляться в нужном формате NumberMaskInput (EPGUCORE-59658)
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

  private relationMinDate(value: string | Date, conditionDate: string): boolean {
    const { dateLeft, dateRight } = this.datesRangeService.parsedDates(value, conditionDate);
    return this.datesToolsService.isSameOrAfter(dateLeft, dateRight);
  }

  private relationMaxDate(value: string | Date, conditionDate: string): boolean {
    const { dateLeft, dateRight } = this.datesRangeService.parsedDates(value, conditionDate);
    return this.datesToolsService.isSameOrBefore(dateLeft, dateRight);
  }

  private changeValidators(component: CustomComponent | Fields, control: AbstractControl): void {
    const validators = [this.validationService.customValidator(component)];
    if (
      component.type === CustomScreenComponentTypes.DateInput ||
      component.type === CustomScreenComponentTypes.MonthPicker ||
      component.type === CustomScreenComponentTypes.CalendarInput ||
      !!(component as MaritalStatusInputField)?.fieldName
    ) {
      validators.push(this.validationService.dateValidator(component, null));
    }
    control.setValidators(validators);
  }

  private relationPatch(
    component: CustomComponent,
    patch: object,
    refControl?: AbstractControl,
  ): void {
    const resultComponent = { ...component, attrs: { ...component.attrs, ...patch } };

    if (!refControl) {
      const control = this.form.controls[this.indexesByIds[component.id]] as FormGroup;
      control.patchValue(
        {
          attrs: { ...component.attrs, ...patch },
        },
        { onlySelf: true, emitEvent: false },
      );
      this.changeValidators(resultComponent, control.controls.value);
      control.get('value').updateValueAndValidity();
    } else {
      this.changeValidators(resultComponent, refControl);
      refControl.updateValueAndValidity();
    }
  }

  private resetRelation(
    component: CustomComponent | Fields,
    accessKey: string,
    refControl?: AbstractControl,
  ): void {
    return this.relationPatch(component, this.cachedAttrsComponents[accessKey]?.base, refControl);
  }

  private setRelationResult(
    component: CustomComponent | Fields,
    result?: Partial<CustomComponent>,
    refControl?: AbstractControl,
  ): void {
    const accessKey = (component as Fields)?.fieldName
      ? (component as Fields).fieldName
      : component.id;

    if (!result) {
      if (this.cachedAttrsComponents[accessKey]) {
        this.resetRelation(component, accessKey, refControl);
      }
      return;
    }
    if (!this.cachedAttrsComponents[accessKey]) {
      this.cachedAttrsComponents[accessKey] = { base: component.attrs, last: '' };
    }

    const stringResult = JSON.stringify(result);
    if (this.cachedAttrsComponents[accessKey].last !== stringResult) {
      component.attrs = this.cachedAttrsComponents[accessKey].base;
      this.relationPatch(component, result.attrs, refControl);
      this.cachedAttrsComponents[accessKey].last = stringResult;
    }
  }

  private updateRelationMap(
    conditions: RelationCondition[],
    value: unknown,
    refComponent: CustomComponent | Fields,
    refControl?: AbstractControl,
  ): void {
    let result;
    for (const condition of conditions) {
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

    this.setRelationResult(refComponent, result, refControl);
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

    // eslint-disable-next-line @typescript-eslint/naming-convention
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
      { updateOn: UpdateOn.ON_CHANGE }, // NOTE: See https://jira.egovdev.ru/browse/EPGUCORE-53355
    );

    if (component.attrs?.hidden) {
      form.disable();
    }

    this.watchFormGroup$(form)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(([prev, next]: [CustomListFormGroup, CustomListFormGroup]) => {
        this.lastChangedComponent = [prev, next];
        const isEqualPrevNext = isEqual(prev, next);
        this._shownElements = this.componentsListRelationsService.processRelations(
          components,
          next,
          this.shownElements,
          this.form,
          true,
          this.screenService,
          componentsGroupIndex,
          isEqualPrevNext,
        );
      });

    return form;
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
}
