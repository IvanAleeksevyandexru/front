import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ValidationShowOn, BrokenDateFixStrategy } from '@epgu/ui/models/common-enums';
import { TextTransformService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { isEmpty } from 'lodash';
import { map, takeUntil } from 'rxjs/operators';
import { TextTransform } from '@epgu/epgu-constructor-types';
import { Observable } from 'rxjs';
import { ListElement } from '@epgu/ui/models/dropdown';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import {
  MaritalStatusInputField,
  MaritalStatusInputFields,
  MaritalStatusInputFieldsTypes,
} from './marital-status-input.types';
import { prepareClassifiedSuggestionItems } from '../../../../core/services/autocomplete/autocomplete.const';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import MaritalStatusInputModelAttrs from './MaritalStatusInputModelAttrs';

@Component({
  selector: 'epgu-constructor-marital-status-input',
  templateUrl: './marital-status-input.component.html',
  styleUrls: ['./marital-status-input.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaritalStatusInputComponent
  extends AbstractComponentListItemComponent<MaritalStatusInputModelAttrs>
  implements OnInit, AfterViewInit {
  public itemsProvider;
  public classifiedSuggestionItems: { [key: string]: ISuggestionItem } = {};
  public MaritalStatusInputFieldsTypes = MaritalStatusInputFieldsTypes;
  public fields: MaritalStatusInputField[];
  public fieldsNames = [
    this.MaritalStatusInputFieldsTypes.date,
    this.MaritalStatusInputFieldsTypes.number,
    this.MaritalStatusInputFieldsTypes.registrator,
  ];

  public validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  public brokenDateFixStrategy = BrokenDateFixStrategy.RESTORE;
  public hasExpirationDate = false;
  public form: FormGroup;

  public constructor(
    public injector: Injector,
    public suggestHandlerService: SuggestHandlerService,
    public screenService: ScreenService,
    private validationService: ValidationService,
    private fb: FormBuilder,
    private textTransform: TextTransformService,
    private dictionaryToolsService: DictionaryToolsService,
  ) {
    super(injector);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.itemsProvider = { search: this.providerSearch() };
    this.fields = this.attrs?.fields as MaritalStatusInputField[];
    this.addFormGroupControls();
    this.subscribeOnFormChange();
    this.updateParentIfNotValid();

    this.screenService.suggestions$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((suggestions) => {
        this.classifiedSuggestionItems = prepareClassifiedSuggestionItems(
          suggestions[this.control.value?.id],
        );

        if (isEmpty(this.classifiedSuggestionItems)) {
          this.classifiedSuggestionItems = Object.keys(suggestions)
            .filter((key) => key.includes(this.control.value?.id))
            .reduce((acc, key) => {
              const [, fieldName] = key.split('.');
              acc[fieldName] = suggestions[key];
              return { ...acc };
            }, {});
        }
      });
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.handleServerErrors();
      this.cdr.markForCheck();
    });
  }

  public handleServerErrors(): void {
    const serverErrorJson = this.control?.get('value')?.errors?.serverError || null;

    if (serverErrorJson) {
      const serverError = JSON.parse(serverErrorJson);

      const fields = [...this.fieldsNames];

      fields.forEach((fieldName: string) => {
        const fieldControl = this.form.get(fieldName);
        if (serverError[fieldName] && fieldControl) {
          fieldControl.setErrors({ msg: serverError[fieldName] });
          fieldControl.markAsDirty();
          fieldControl.markAsTouched();
          this.cdr.markForCheck();
        }
      });
    }
  }

  public updateParentIfNotValid(): void {
    if (!this.form.valid) {
      this.emitToParentForm(null);
    }
  }

  public subscribeOnFormChange(): void {
    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((formFields) => {
      const patchedFormFields = Object.entries(formFields).reduce<MaritalStatusInputFields>(
        (acc: MaritalStatusInputFields, [key, value]) => {
          if (this.fields[key]?.attrs?.fstuc) {
            const textTransformType: TextTransform = this.fields[key].attrs.fstuc;
            const newValue = value
              ? this.textTransform.transform(value.toString(), textTransformType)
              : value;

            if (this.form.get(key)) {
              this.form.get(key).setValue(newValue, { emitEvent: false });
            }
            return { ...acc, [key]: newValue };
          }
          return { ...acc, [key]: value };
        },
        {} as MaritalStatusInputFields,
      );
      this.emitToParentForm(patchedFormFields);
      this.cdr.markForCheck();
    });
  }

  public emitToParentForm(formFields: MaritalStatusInputFields): void {
    if (this.form.valid) {
      this.control.get('value').setValue(formFields);
    } else {
      this.control.get('value').setErrors({ invalidForm: true });
    }
    this.formService.emitChanges();
  }

  public markControlAsDirty(control: string | string[]): void {
    this.form.get(control).markAsDirty();
    this.form.get(control).updateValueAndValidity();
  }

  public isInvalidAndDirty(control: string | string[]): boolean {
    return this.form.get(control).invalid && this.form.get(control).dirty;
  }

  public isInvalidAndTouched(control: string | string[]): boolean {
    return this.form.get(control).invalid && this.form.get(control).touched;
  }

  public getFieldByName(fieldName: string): MaritalStatusInputField | null {
    return this.fields.find((item) => item.fieldName === fieldName);
  }

  private addFormGroupControls(): void {
    const componentValues = this.getParsedComponentValues();

    const fields = this.fieldsNames.reduce((acc: object, fieldName: string) => {
      const subComponent = this.getFieldByName(fieldName);
      if (!subComponent) return acc;

      const validators = [this.validationService.customValidator(subComponent)];
      const value =
        fieldName === MaritalStatusInputFieldsTypes.date && componentValues[fieldName]
          ? new Date(componentValues[fieldName])
          : componentValues[fieldName];

      return {
        ...acc,
        [fieldName]: new FormControl(value, [...validators]),
      };
    }, {});

    this.form = this.fb.group(fields);
  }

  private getParsedComponentValues(): MaritalStatusInputFields {
    return typeof this.control.value.value === 'object'
      ? this.control.value.value
      : JSON.parse(this.control.value.value || '{}');
  }

  private providerSearch(): (val: string) => Observable<Partial<ListElement>[]> {
    return (searchString): Observable<Partial<ListElement>[]> => {
      const regComponent = this.getFieldByName(MaritalStatusInputFieldsTypes.registrator);
      const filters = [...regComponent.attrs.searchProvider.dictionaryFilter];
      filters[0].value = searchString;
      const value = new FormArray(
        Object.keys(this.form.controls).map(
          (fieldId) =>
            new FormControl({
              ...this.getFieldByName(fieldId),
              id: fieldId,
              value: this.form.get(fieldId).value,
            }),
        ),
      );

      const dictionaryOptions = this.dictionaryToolsService.getFilterOptions(
        value,
        this.screenService.getStore(),
        filters,
      );

      return this.dictionaryToolsService
        .getDictionaries$(regComponent.attrs.dictionaryType, regComponent, {
          ...(regComponent.attrs.searchProvider.dictionaryOptions || {}),
          ...dictionaryOptions,
        })
        .pipe(
          map((reference) => {
            return this.dictionaryToolsService.adaptDictionaryToListItem(
              reference.data.items,
              reference.component.attrs.mappingParams,
              false,
            );
          }),
        );
    };
  }
}
