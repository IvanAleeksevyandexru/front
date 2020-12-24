import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DadataResult, ValidationShowOn } from 'epgu-lib';
import { startWith, takeUntil } from 'rxjs/operators';
import * as moment_ from 'moment';
import { combineLatest, Observable } from 'rxjs';
import { ConfigService } from '../../../../../../../../core/config/config.service';
import { UnsubscribeService } from '../../../../../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { DateValidator } from './date-validator';
import {
  FieldNames,
  IRegistrationAddrComponent,
  RegistrationAddrFields,
  RegistrationAddrHints,
} from '../../registration-addr-screen.types';

const moment = moment_;

@Component({
  selector: 'epgu-constructor-registration-addr',
  templateUrl: './registration-addr.component.html',
  styleUrls: ['./registration-addr.component.scss'],
  providers: [UnsubscribeService],
})
export class RegistrationAddrComponent implements OnInit {
  data$: Observable<IRegistrationAddrComponent> = this.screenService.component$ as Observable<
    IRegistrationAddrComponent
  >;
  required: boolean;

  error$: Observable<string> = this.screenService.componentError$;
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
    combineLatest([this.data$, this.screenService.display$])
      .pipe(takeUntil(this.ngUnsubscribe$), takeUntil(this.screenService.isNextScreen$))
      .subscribe(([data]) => {
        this.required = data.required;
        this.initFormGroup(data);
        this.subscribeToFormChanges(data);
      });
  }

  initFormGroup(data: IRegistrationAddrComponent): void {
    const controls = {};
    const initData = JSON.parse(data?.value || '{}');

    data?.attrs?.fields.forEach((field) => {
      const formControlValue = this.getInitFormValue(initData, field.fieldName);
      controls[field.fieldName] = this.fb.control(
        { value: formControlValue, disabled: field.disabled },
        this.getValidatorsForField(field),
      );
    });
    this.redAddrForm = this.fb.group(controls);
  }

  hintClick({ amount, unit }: RegistrationAddrHints): void {
    const regDate = moment().add(amount, unit).toDate();
    this.redAddrForm.patchValue({ regDate });
  }

  private getValidatorsForField(field: RegistrationAddrFields): ValidatorFn[] {
    const regExp = field?.regexp || null;
    const isRequired = this.required;
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

  private subscribeToFormChanges(data: IRegistrationAddrComponent): void {
    this.redAddrForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$), startWith(this.redAddrForm.value))
      .subscribe((changes) => {
        delete this.screenService.componentErrors[data.id];
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
  private getInitFormValue(
    data: { regAddr: DadataResult; regFrom: string; regTo: string },
    fieldName: FieldNames,
  ): string | Date {
    if (fieldName === FieldNames.regAddr) {
      return data?.regAddr?.fullAddress || null;
    }
    if (
      fieldName === FieldNames.regFrom ||
      fieldName === FieldNames.regTo ||
      fieldName === FieldNames.regDate
    ) {
      return data[fieldName] ? new Date(data[fieldName]) : null;
    }
    return null;
  }
}
