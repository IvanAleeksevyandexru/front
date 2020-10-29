import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { startWith, takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../../../../../core/config/config.service';
import { UnsubscribeService } from '../../../../../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { TemporaryRegistrationComponent } from '../../temporary-registration-addr-screen.types';
import { DateValidator } from './date-validator';

@Component({
  selector: 'epgu-constructor-temporary-registration-addr',
  templateUrl: './temporary-registration-addr.component.html',
  styleUrls: ['./temporary-registration-addr.component.scss'],
  providers: [UnsubscribeService],
})
export class TemporaryRegistrationAddrComponent implements OnInit {
  @Input() data: TemporaryRegistrationComponent;
  @Input() error: string;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  redAddrForm: FormGroup;

  constructor(
    public config: ConfigService,
    private currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.subscribeToFormChanges();
  }

  initFormGroup(): void {
    const controls = {};
    const initValue = this.getInitValue(this.data?.value);

    this.data?.attrs?.fields.forEach((field) => {
      controls[field.fieldName] = this.fb.control(initValue, this.getValidatorsForField(field));
    });
    this.redAddrForm = this.fb.group(controls);
  }

  hintClick(timestamp: number) {
    const currentDayTimestamp = new Date().getTime();
    this.redAddrForm.patchValue({ regDate: new Date(currentDayTimestamp + timestamp) });
  }

  private getValidatorsForField(field): ValidatorFn[] {
    const regExp = field?.regexp || null;
    const isRequired = this.data.required;
    const isDateType = field?.type === 'date';
    const validators: Array<ValidatorFn> = [];
    if (regExp) {
      validators.push(Validators.pattern(regExp));
    }

    if (isDateType) {
      validators.push(DateValidator.date);
    }

    if (isRequired) {
      validators.push(Validators.required);
    }

    return validators;
  }

  private subscribeToFormChanges(): void {
    this.redAddrForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$), startWith(this.redAddrForm.value))
      .subscribe((changes) => {
        if (this.redAddrForm.invalid) {
          this.currentAnswersService.isValid = false;
        } else {
          this.currentAnswersService.isValid = true;
          this.currentAnswersService.state = changes;
        }
      });
  }

  /**
   * метод парсит (при наличие) строку с объектом от dadata-widget и возвращает в него fullAddress
   * @param value строка с JSON объектом от dadata-widget
   */
  private getInitValue(value: string) {
    return (value && JSON.parse(value).regAddr.fullAddress) || null;
  }
}
