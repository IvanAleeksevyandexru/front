import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  TextTransformService,
  UnsubscribeService,
  DatesToolsService,
  DATE_STRING_DOT_FORMAT,
} from '@epgu/epgu-constructor-ui-kit';
import { map, takeUntil } from 'rxjs/operators';
import { TextTransform } from '@epgu/epgu-constructor-types';
import { BrokenDateFixStrategy, ValidationShowOn } from '@epgu/ui/models/common-enums';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import {
  DocInputField,
  DocInputFields,
  DocInputFieldsTypes,
  DocInputFormFields,
} from './doc-input.types';
import { prepareClassifiedSuggestionItems } from '../../../../core/services/autocomplete/autocomplete.const';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { AutocompleteService } from '../../../../core/services/autocomplete/autocomplete.service';

@Component({
  selector: 'epgu-constructor-doc-input',
  templateUrl: './doc-input.component.html',
  styleUrls: ['./doc-input.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class DocInputComponent extends AbstractComponentListItemComponent
  implements OnInit, AfterViewInit {
  classifiedSuggestionItems: { [key: string]: ISuggestionItem } = {};
  docInputFieldsTypes = DocInputFieldsTypes;
  fields: { [fieldName: string]: DocInputField };
  fieldsNames = [
    this.docInputFieldsTypes.series,
    this.docInputFieldsTypes.number,
    this.docInputFieldsTypes.date,
    this.docInputFieldsTypes.emitter,
  ];

  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  brokenDateFixStrategy = BrokenDateFixStrategy.RESTORE;
  hasExpirationDate = false;
  form: FormGroup;

  constructor(
    public injector: Injector,
    public suggestHandlerService: SuggestHandlerService,
    public screenService: ScreenService,
    private autocompleteService: AutocompleteService,
    private validationService: ValidationService,
    private fb: FormBuilder,
    private datesToolsService: DatesToolsService,
    private textTransform: TextTransformService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.fields = this.control.value.attrs.fields;
    this.hasExpirationDate = !!this.fields?.expirationDate;
    this.addFormGroupControls();
    this.subscribeOnFormChange();
    this.updateParentIfNotValid();

    this.screenService.suggestions$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((suggestions) => {
        const flatSuggestions: ISuggestionItem = Object.keys(suggestions).reduce(
          (acc, key) => {
            if (key.includes(this.control.value?.id)) {
              acc.list = [...acc.list, ...suggestions[key].list];
            }
            return acc;
          },
          { mnemonic: '', list: [] },
        );
        this.classifiedSuggestionItems = prepareClassifiedSuggestionItems(
          flatSuggestions,
          null,
          this.fieldsNames,
          Array.from(this.autocompleteService.componentsSuggestionsSet),
        );
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // updateValueAndValidity необходим для отработки transform функций после первой подстановки значений в форму
      this.form.updateValueAndValidity();
      this.handleServerErrors();
      this.cdr.markForCheck();
    }); // https://stackoverflow.com/questions/54611631/expressionchangedafterithasbeencheckederror-on-angular-6-while-using-mat-tab
  }

  /**
   * If there are server errors - adds them to appropriate fields and displays by setting field's state to touched
   */
  handleServerErrors(): void {
    const serverErrorJson = this.control?.get('value')?.errors?.serverError || null;

    if (serverErrorJson) {
      const serverError = JSON.parse(serverErrorJson);

      const fields = [...this.fieldsNames];

      if (this.hasExpirationDate) {
        fields.push(this.docInputFieldsTypes.expirationDate);
      }

      fields.forEach((fieldName: string) => {
        const fieldControl =
          this.form.get(fieldName) ||
          this.form.get([this.docInputFieldsTypes.seriesNumDate, fieldName]);
        if (serverError[fieldName] && fieldControl) {
          fieldControl.setErrors({ msg: serverError[fieldName] });
          fieldControl.markAsDirty();
          fieldControl.markAsTouched();
        }
      });
    }
  }

  updateParentIfNotValid(): void {
    if (!this.form.valid) {
      this.emitToParentForm(null);
    }
  }

  subscribeOnFormChange(): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        map((formFields: DocInputFormFields) => this.formatFormFields(formFields)),
      )
      .subscribe((formFields) => {
        // see https://stackoverflow.com/questions/58375385/angular-directive-transform-value-of-form-control
        const patchedFormFields = Object.entries(formFields).reduce<DocInputFields>(
          (acc: DocInputFields, [key, value]) => {
            if (this.fields[key]?.attrs?.fstuc) {
              const textTransformType: TextTransform = this.fields[key].attrs.fstuc;
              const newValue = value
                ? this.textTransform.transform(value.toString(), textTransformType)
                : value;
              const control =
                this.form.get(key) || this.form.get([this.docInputFieldsTypes.seriesNumDate, key]);

              if (control) {
                control.setValue(newValue, { emitEvent: false });
              }
              return { ...acc, [key]: newValue };
            }
            return { ...acc, [key]: value };
          },
          {} as DocInputFields,
        );
        this.emitToParentForm(patchedFormFields);
        this.cdr.markForCheck();
      });
  }

  formatFormFields(formFields: DocInputFormFields): DocInputFields {
    const expirationDateField = formFields[this.docInputFieldsTypes.expirationDate];
    const isValidExpirationDate = this.datesToolsService.isValid(expirationDateField);
    const expirationDate =
      this.hasExpirationDate && isValidExpirationDate
        ? {
            expirationDate: expirationDateField
              ? this.datesToolsService.format(expirationDateField)
              : null,
          }
        : {};
    const { seriesNumDate } = formFields;

    return {
      ...seriesNumDate,
      ...expirationDate,
      date: seriesNumDate.date ? this.datesToolsService.format(seriesNumDate.date) : null,
      emitter: formFields.emitter,
    };
  }

  emitToParentForm(formFields: DocInputFields): void {
    if (this.form.valid) {
      this.control.get('value').setValue(formFields);
    } else {
      this.control.get('value').setErrors({ invalidForm: true });
    }
    this.formService.emitChanges();
  }

  addFormGroupControls(): void {
    const componentValues = this.getParsedComponentValues();

    const seriesNumDate = {
      [this.fieldsNames[0]]: null,
      [this.fieldsNames[1]]: null,
      [this.fieldsNames[2]]: null,
    };
    const emitter = {
      [this.fieldsNames[3]]: null,
    };

    this.fieldsNames.forEach((fieldName: string) => {
      const validators = [this.validationService.customValidator(this.fields[fieldName])];

      const updateOnValidation = this.fields[fieldName].attrs.validation?.find(
        (v) => v.updateOn === 'blur',
      );

      if (Object.prototype.hasOwnProperty.call(seriesNumDate, fieldName)) {
        seriesNumDate[fieldName] = new FormControl(componentValues[fieldName], {
          validators,
          updateOn: updateOnValidation?.updateOn || 'change',
        });
      } else {
        emitter[fieldName] = new FormControl(componentValues[fieldName], {
          validators,
          updateOn: updateOnValidation?.updateOn || 'change',
        });
      }
    });

    this.form = this.fb.group({
      [this.docInputFieldsTypes.seriesNumDate]: this.fb.group(seriesNumDate),
      ...emitter,
    });
    const emitterControl = this.form.controls.emitter;

    if (emitterControl.value) {
      emitterControl.markAllAsTouched();
      emitterControl.markAsDirty();
      emitterControl.updateValueAndValidity();
      emitterControl.setErrors(null);
    }

    if (this.hasExpirationDate) {
      const expirationDate = componentValues[this.docInputFieldsTypes.expirationDate];

      this.form.setControl(
        this.docInputFieldsTypes.expirationDate,
        new FormControl(expirationDate, [
          ...[
            this.validationService.customValidator(
              this.fields[this.docInputFieldsTypes.expirationDate],
            ),
          ],
        ]),
      );
    }
  }

  markControlAsDirty(control: string | string[]): void {
    this.form.get(control).markAsDirty();
    this.form.get(control).updateValueAndValidity();
  }

  isInvalidAndDirty(control: string | string[]): boolean {
    return this.form.get(control).invalid && this.form.get(control).dirty;
  }

  isInvalidAndTouched(control: string | string[]): boolean {
    return this.form.get(control).invalid && this.form.get(control).touched;
  }

  isErrorShown(control: string | string[]): boolean {
    return (
      (this.isInvalidAndTouched(control) || this.isInvalidAndDirty(control)) &&
      this.form.get(control).errors.msg
    );
  }

  private getParsedComponentValues(): DocInputFields {
    const componentValues =
      typeof this.control.value.value === 'object'
        ? this.control.value.value
        : JSON.parse(this.control.value.value || '{}');

    return {
      ...componentValues,
      date: componentValues.date
        ? this.datesToolsService.parse(componentValues.date, DATE_STRING_DOT_FORMAT)
        : null,
      expirationDate: componentValues.expirationDate
        ? this.datesToolsService.parse(componentValues.expirationDate, DATE_STRING_DOT_FORMAT)
        : null,
    };
  }
}
