import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import {
  TextTransformService,
  UnsubscribeService,
  DatesToolsService,
  DATE_STRING_DOT_FORMAT,
} from '@epgu/epgu-constructor-ui-kit';
import { TextTransform } from '@epgu/epgu-constructor-types';
import {
  BrokenDateFixStrategy,
  RemoveMaskSymbols,
  ValidationShowOn,
} from '@epgu/ui/models/common-enums';
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
import DocInputModelAttrs from './DocInputModelAttrs';

@Component({
  selector: 'epgu-constructor-doc-input',
  templateUrl: './doc-input.component.html',
  styleUrls: ['./doc-input.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.Default, // TODO
})
export class DocInputComponent extends AbstractComponentListItemComponent<DocInputModelAttrs>
  implements OnInit, AfterViewInit {
  public RemoveMaskSymbols = RemoveMaskSymbols;
  classifiedSuggestionItems: { [key: string]: ISuggestionItem } = {};
  docInputFieldsTypes = DocInputFieldsTypes;
  fields: { [fieldName: string]: DocInputField };
  fieldsNames = [
    this.docInputFieldsTypes.series,
    this.docInputFieldsTypes.number,
    this.docInputFieldsTypes.date,
    this.docInputFieldsTypes.emitter,
    this.docInputFieldsTypes.issueId,
  ];

  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  brokenDateFixStrategy = BrokenDateFixStrategy.RESTORE;
  hasExpirationDate = false;
  form: FormGroup;
  formIssueId: AbstractControl;

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
    this.fields = (this.attrs?.fields as unknown) as { [fieldName: string]: DocInputField };
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
    // updateValueAndValidity необходим для отработки transform функций после первой подстановки значений в форму
    this.form.updateValueAndValidity();
    this.handleServerErrors();
    this.cdr.markForCheck();
  }

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
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
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
        this.form.markAsDirty();
        this.form.updateValueAndValidity();
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
      issueId: formFields.issueId,
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
    const issueId = {
      [this.fieldsNames[4]]: null,
    };

    this.fieldsNames.forEach((fieldName: string) => {
      if (this.fields[fieldName]) {
        const validators = [this.validationService.customValidator(this.fields[fieldName])];

        const updateOnValidation = this.fields[fieldName].attrs.validation?.find(
          (v) => v.updateOn === 'blur',
        );

        if (Object.prototype.hasOwnProperty.call(seriesNumDate, fieldName)) {
          seriesNumDate[fieldName] = new FormControl(componentValues[fieldName], {
            validators,
            updateOn: updateOnValidation?.updateOn || 'change',
          });
        } else if (Object.prototype.hasOwnProperty.call(emitter, fieldName)) {
          emitter[fieldName] = new FormControl(componentValues[fieldName], {
            validators,
            updateOn: updateOnValidation?.updateOn || 'change',
          });
        } else if (Object.prototype.hasOwnProperty.call(issueId, fieldName)) {
          issueId[fieldName] = new FormControl(componentValues[fieldName], {
            validators,
            updateOn: updateOnValidation?.updateOn || 'change',
          });
        }
      }
    });

    this.form = this.fb.group({
      [this.docInputFieldsTypes.seriesNumDate]: this.fb.group(seriesNumDate),
      ...emitter,
      ...issueId,
    });
    this.formIssueId = this.form.get(this.docInputFieldsTypes.issueId);
    const emitterControl = this.form.controls.emitter;
    const issueIdControl = this.form.controls.issueId;

    if (emitterControl.value) {
      emitterControl.markAllAsTouched();
      emitterControl.markAsDirty();
      emitterControl.updateValueAndValidity();
      emitterControl.setErrors(null);
    }

    if (issueIdControl.value) {
      issueIdControl.markAllAsTouched();
      issueIdControl.markAsDirty();
      issueIdControl.updateValueAndValidity();
      issueIdControl.setErrors(null);
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
    const updateOn = this.form.get(control).updateOn;
    return (
      (updateOn === 'change'
        ? this.isInvalidAndTouched(control)
        : this.isInvalidAndDirty(control)) && this.form.get(control).errors.msg
    );
  }

  private getParsedComponentValues(): DocInputFields {
    const componentValues =
      typeof this.control.value.value === 'object'
        ? this.control.value.value
        : JSON.parse(this.control.value.value || '{}');

    return {
      ...componentValues,
      // В componentValues может быть строка в ISO формате и в dd.MM.yyyy формате
      date: componentValues.date ? this.prepareDate(componentValues.date) : null,
      expirationDate: componentValues.expirationDate
        ? this.prepareDate(componentValues.expirationDate)
        : null,
    };
  }

  private prepareDate(date: string): Date {
    let newDate = this.datesToolsService.parse(date);
    if (!this.datesToolsService.isValid(newDate)) {
      newDate = this.datesToolsService.parse(date, DATE_STRING_DOT_FORMAT);
    }
    return newDate;
  }
}
