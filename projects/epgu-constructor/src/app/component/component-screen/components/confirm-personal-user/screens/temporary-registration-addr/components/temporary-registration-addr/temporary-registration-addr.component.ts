import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { startWith, takeUntil } from 'rxjs/operators';
import * as moment_ from 'moment';

import { ConfigService } from '../../../../../../../../core/config/config.service';
import { UnsubscribeService } from '../../../../../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import {
  FieldNames,
  TemporaryRegistrationComponent,
  TemporaryRegistrationHints,
} from '../../temporary-registration-addr-screen.types';
import { DateValidator } from './date-validator';
import { ScreenService } from '../../../../../../../../screen/screen.service';

const moment = moment_;

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
    private screenService: ScreenService,
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
    const initData = JSON.parse(this.data?.value || '{}');

    this.data?.attrs?.fields.forEach((field) => {
      const formControlValue = this.getInitFormValue(initData, field.fieldName);
      controls[field.fieldName] = this.fb.control(
        formControlValue,
        this.getValidatorsForField(field),
      );
    });
    this.redAddrForm = this.fb.group(controls);
  }

  hintClick({ amount, unit }: TemporaryRegistrationHints) {
    const regDate = moment().add(amount, unit).toDate();
    this.redAddrForm.patchValue({ regDate });
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
        delete this.screenService.componentErrors[this.data.id];
        if (this.redAddrForm.invalid) {
          this.currentAnswersService.isValid = false;
        } else {
          this.currentAnswersService.isValid = true;
          this.currentAnswersService.state = changes;
        }
      });
  }

  /**
   * метод возвращает (при наличие) начальное значение для контрола формы
   * @param fieldName - имя поля
   * @param data строка с JSON объектом
   */
  private getInitFormValue(data: any, fieldName: FieldNames): string | Date {
    if (fieldName === FieldNames.regAddr) {
      return data?.regAddr?.fullAddress || null;
    }
    if (fieldName === FieldNames.regDate) {
      return data?.regDate ? new Date(data?.regDate) : null;
    }
    return null;
  }
}
