import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ListElement } from '@epgu/epgu-lib';
import { startWith, takeUntil } from 'rxjs/operators';

import { FormField, FormValue, PaymentType } from '../../mat-period.models';
import { DurationService } from '../../service/duration.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { ValidationService } from '../../../../../../shared/services/validation/validation.service';
import { CustomComponent } from '../../../../../custom-screen/components-list.types';

@Component({
  selector: 'epgu-constructor-mat-period-form',
  templateUrl: './mat-period-form.component.html',
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatPeriodFormComponent implements OnInit {
  @Input() components: { [key in FormField]: CustomComponent };
  @Input() cachedValue?: FormValue['data'];
  @Output() updateStateEvent = new EventEmitter<FormValue>();
  durations: { [key in PaymentType]: ListElement[] };
  formField = FormField;
  form: FormGroup;

  constructor(
    public durationService: DurationService,
    private fb: FormBuilder,
    private ngUnsubscribe$: UnsubscribeService,
    private validationService: ValidationService,
  ) {}

  ngOnInit(): void {
    this.initForm(this.cachedValue);
    this.durations = this.durationService.initDurations();
  }

  private initForm(cachedValue: FormValue['data'] | null): void {
    this.form = this.fb.group({
      [this.formField.paymentType]: new FormControl(
        cachedValue[this.formField.paymentType] || 'one',
      ),
      [this.formField.amount]: new FormControl(
        cachedValue[this.formField.amount] || null,
        this.validationService.customValidator(this.components[this.formField.amount]),
      ),
      [this.formField.startPayment]: new FormControl(
        cachedValue[this.formField.startPayment] || null,
      ),
      [this.formField.finishPayment]: new FormControl(
        cachedValue[this.formField.finishPayment] || null,
      ),
      [this.formField.paymentDate]: new FormControl(
        cachedValue[this.formField.paymentDate] || null,
        this.getPaymentDateValidators(cachedValue[this.formField.paymentType] || 'one'),
      ),
    });

    this.form.valueChanges
      .pipe(startWith(this.form.value), takeUntil(this.ngUnsubscribe$))
      .subscribe((value: FormValue['data']) => this.updateState(value));

    this.form
      .get(this.formField.startPayment)
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((date) => this.updateFinishPaymentControl(date));

    this.form
      .get(this.formField.paymentType)
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((paymentType: PaymentType) => this.updatePaymentDateControl(paymentType));
  }

  private updateState(value: FormValue['data']): void {
    const { paymentDate, startPayment, paymentType } = value;
    const transformedPaymentDate = this.durationService.transformDayToDate(
      paymentDate,
      startPayment?.date,
      paymentType,
    );
    this.updateStateEvent.emit({
      isValid: this.form.valid,
      data: {
        ...value,
        paymentDate: transformedPaymentDate,
      },
    });
  }

  private updateFinishPaymentControl(date: string): void {
    if (date) {
      this.form.get(this.formField.finishPayment).setValue(null);
      this.form.get(this.formField.finishPayment).enable();
    } else {
      this.form.get(this.formField.finishPayment).setValue(null);
      this.form.get(this.formField.finishPayment).disable();
    }
  }

  private updatePaymentDateControl(paymentType: PaymentType): void {
    this.form.get(this.formField.startPayment).setValue(null);
    this.form.get(this.formField.finishPayment).setValue(null);
    const paymentDateControl = this.form.get(this.formField.paymentDate);
    paymentDateControl.setValue(null);
    paymentDateControl.setValidators(this.getPaymentDateValidators(paymentType));
  }

  private getPaymentDateValidators(paymentType: PaymentType): ValidatorFn | null {
    return paymentType === 'one'
      ? this.validationService.dateValidator(this.components[this.formField.paymentDate])
      : this.validationService.customValidator(this.components[this.formField.paymentDate]);
  }
}
