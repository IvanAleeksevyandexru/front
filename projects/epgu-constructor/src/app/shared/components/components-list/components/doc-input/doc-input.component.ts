import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ValidationShowOn, BrokenDateFixStrategy } from 'epgu-lib';
import { map, takeUntil } from 'rxjs/operators';
import { ISuggestionItem } from '../../../../../core/services/autocomplete/autocomplete.inteface';
import { DatesToolsService } from '../../../../../core/services/dates-tools/dates-tools.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { ValidationService } from '../../../../services/validation/validation.service';
import {
  DocInputField,
  DocInputFields,
  DocInputFieldsTypes,
  DocInputFormFields,
} from './doc-input.types';
import { prepareClassifiedSuggestionItems } from '../../../../../core/services/autocomplete/autocomplete.const';
import { SuggestHandlerService } from '../../../../services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';

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
    private validationService: ValidationService,
    private fb: FormBuilder,
    private datesToolsService: DatesToolsService,
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
        this.classifiedSuggestionItems = prepareClassifiedSuggestionItems(
          suggestions[this.control.value?.id],
        );
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
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
        this.emitToParentForm(formFields);
        this.cdr.markForCheck();
      });
  }

  formatFormFields(formFields: DocInputFormFields): DocInputFields {
    const expirationDate = this.hasExpirationDate
      ? {
          expirationDate: formFields[this.docInputFieldsTypes.expirationDate]
            ? this.datesToolsService.format(formFields[this.docInputFieldsTypes.expirationDate])
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

      if (Object.prototype.hasOwnProperty.call(seriesNumDate, fieldName)) {
        seriesNumDate[fieldName] = new FormControl(componentValues[fieldName], [...validators]);
      } else {
        emitter[fieldName] = new FormControl(componentValues[fieldName], [...validators]);
      }
    });

    this.form = this.fb.group({
      [this.docInputFieldsTypes.seriesNumDate]: this.fb.group(seriesNumDate),
      ...emitter,
    });

    if (this.hasExpirationDate) {
      const expirationDate = componentValues[this.docInputFieldsTypes.expirationDate]
        ? new Date(componentValues[this.docInputFieldsTypes.expirationDate])
        : null;
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

  isValidationShown(control: string | string[]): boolean {
    return this.form.get(control).invalid && this.form.get(control).dirty;
  }

  private getParsedComponentValues(): DocInputFields {
    const componentValues =
      typeof this.control.value.value === 'object'
        ? this.control.value.value
        : JSON.parse(this.control.value.value || '{}');

    return {
      ...componentValues,
      date: componentValues.date ? new Date(componentValues.date) : null,
    };
  }
}
