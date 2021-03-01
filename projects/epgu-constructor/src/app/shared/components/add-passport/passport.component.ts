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
  SimpleChanges,
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
import { ValidationShowOn } from 'epgu-lib';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { ComponentBase } from '../../../screen/screen.types';
import { PassportAttr, PassportFields, PassportFormFields } from './passport.interface';
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
  @Input() attrs: PassportAttr;
  @Input() suggestions: ISuggestionItem;
  @Output() selectSuggest: EventEmitter<ISuggestionItem | ISuggestionItemList> = new EventEmitter<
    ISuggestionItem | ISuggestionItemList
  >();

  public passportForm: FormGroup;
  public fieldsNames: Array<string> = [];

  classifiedSuggestionItems: { [key: string]: ISuggestionItem } = {};
  touchedUnfocused = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(
    private fb: FormBuilder,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.subscribeToFormChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.suggestions.currentValue) {
      this.classifiedSuggestionItems = prepareClassifiedSuggestionItems(this.suggestions);
    }
  }

  initFormGroup(): void {
    const controls = {};
    this.attrs.fields.forEach((field) => {
      this.fieldsNames.push(field.fieldName);
      controls[field.fieldName] = this.fb.control(null, this.getValidatorsForField(field));
    });
    this.passportForm = this.fb.group(controls);
  }

  getValidatorsForField(field: PassportFields): ValidatorFn[] {
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
        this.eventBusService.emit('passportValueChangedEvent', value);
        this.changeDetectionRef.markForCheck();
      });
  }

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
}
