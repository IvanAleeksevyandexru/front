import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

import {
  BusEventType,
  EventBusService,
  FocusManagerService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { FocusState } from '@epgu/ui/services/focus';
import { ComponentBase } from '../../../screen/screen.types';
import { PassportAttr, PassportField, PassportFormFields } from './passport.interface';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../../core/services/autocomplete/autocomplete.inteface';
import { prepareClassifiedSuggestionItems } from '../../../core/services/autocomplete/autocomplete.const';

@Component({
  selector: 'epgu-constructor-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.scss'],
  providers: [
    UnsubscribeService,
    {
      provide: NG_VALUE_ACCESSOR,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      useExisting: forwardRef(() => PassportComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      useExisting: forwardRef(() => PassportComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassportComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {
  @Input() componentId: string;
  @Input() attrs: PassportAttr;
  @Input() suggestions: ISuggestionItem;
  @Output() selectSuggest: EventEmitter<ISuggestionItem | ISuggestionItemList> = new EventEmitter<
    ISuggestionItem | ISuggestionItemList
  >();

  public readonly DEFAULT_TITLE = '?????????????? ????';

  public passportForm: FormGroup;
  public fieldsNames: string[] = [];

  classifiedSuggestionItems: { [key: string]: ISuggestionItem } = {};
  touchedUnfocused = ValidationShowOn.TOUCHED_UNFOCUSED;
  valueErrorsList: { [key: string]: { errorMsg: string; label: string } } = {};
  focusedInputId: string;

  constructor(
    private fb: FormBuilder,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef,
    private focusManager: FocusManagerService,
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.subscribeToFormChanges();

    this.focusManager.state$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((state) => this.setFocusedInput(state));
  }

  ngOnChanges(): void {
    this.classifiedSuggestionItems = prepareClassifiedSuggestionItems(this.suggestions);
  }

  initFormGroup(): void {
    const controls = {};
    this.attrs.fields.forEach((field) => {
      this.fieldsNames.push(field.fieldName);
      this.setValueErrorListItem(field);

      controls[field.fieldName] = this.fb.control(null, this.getValidatorsForField(field));
    });
    this.passportForm = this.fb.group(controls);
  }

  getValidatorsForField(field: PassportField): ValidatorFn[] {
    const validators = [Validators.required];

    if (field.maxlength) {
      validators.push(Validators.maxLength(field.maxlength));
    }
    if (field.minlength) {
      validators.push(Validators.minLength(field.minlength));
    }
    if (field.regexp) {
      validators.push(Validators.pattern(field.regexp));
    }

    return validators;
  }

  subscribeToFormChanges(): void {
    this.passportForm.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        debounceTime(300),
        filter(() => this.passportForm.valid),
      )
      .subscribe((value: ComponentBase) => {
        this.eventBusService.emit(BusEventType.PassportValueChangedEvent, value);
        this.cdr.markForCheck();
      });
  }

  // eslint-disable-next-line no-empty-function
  public onTouched: Function = () => {};

  writeValue(val: PassportFormFields): void {
    const isValidValue = (value, fieldName): boolean => {
      return typeof value === 'object' && value !== null && value[fieldName];
    };

    this.fieldsNames.forEach((fieldName: string) => {
      if (isValidValue(val, fieldName)) {
        this.passportForm.controls[fieldName].setValue(val[fieldName], { emitEvent: false });
      }
    });
  }

  registerOnChange(fn: () => void): void {
    this.passportForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.passportForm.disable();
    } else {
      this.passportForm.enable();
    }
  }

  validate(): ValidationErrors | null {
    return this.passportForm.valid
      ? null
      : { invalidForm: { valid: false, message: 'PassportComponent fields are invalid' } };
  }

  hasWrongValue(control: string | string[]): boolean {
    return (
      this.passportForm.get(control).invalid &&
      this.passportForm.get(control).dirty &&
      this.passportForm.get(control).value
    );
  }

  hasNoValue(control: string | string[]): boolean {
    return (
      this.passportForm.get(control).invalid &&
      this.passportForm.get(control).touched &&
      this.passportForm.get(control).hasError('required')
    );
  }

  showOnFocus(fieldName: string): boolean {
    return this.passportForm.get(fieldName).touched && fieldName !== this.focusedInputId;
  }

  private setFocusedInput(state: FocusState): void {
    this.focusedInputId = state?.current?.id;
    this.cdr.markForCheck();
  }

  private setValueErrorListItem(field: PassportField): void {
    this.valueErrorsList[field.fieldName] = {
      errorMsg: field.errorMsg,
      label: field.label,
    };
  }
}
