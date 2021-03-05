import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';
import { startWith, takeUntil } from 'rxjs/operators';

import { FormField, FormValue, PaymentType } from '../../mat-period.models';
import { DurationService } from '../../service/duration.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { ValidationService } from '../../../../../../shared/services/validation/validation.service';
import { CustomComponent } from '../../../../../shared/components/components-list/components-list.types';

@Component({
  selector: 'epgu-constructor-mat-period-form',
  templateUrl: './mat-period-form.component.html',
  styleUrls: ['./mat-period-form.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatPeriodFormComponent implements OnInit {
  @Input() components: { [key in FormField]: CustomComponent };
  @Input() cachedValue?: FormValue;
  @Output() updateStateEvent = new EventEmitter<FormValue>();
  form: FormGroup;
  durations: { [key in PaymentType]: ListElement[] };
  formField = FormField;
  readonly maskOptions = {
    decimalSymbol: ',',
    allowDecimal: true,
  };

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

  initForm(cachedValue: FormValue | null): void {
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
        this.validationService.customValidator(this.components[this.formField.paymentDate]),
      ),
    });

    this.form.valueChanges
      .pipe(startWith(this.form.value), takeUntil(this.ngUnsubscribe$))
      .subscribe((value: FormValue) => {
        console.log(this.form.value);
        const paymentDate = this.durationService.transformDayToDate(
          value[FormField.paymentDate],
          value[FormField.startPayment]?.date,
          value[FormField.paymentType],
        );
        this.updateStateEvent.emit({
          ...value,
          paymentDate,
        });
      });

    this.form
      .get(this.formField.startPayment)
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((date) => {
        if (date) {
          this.form.get(this.formField.finishPayment).setValue(null);
          this.form.get(this.formField.finishPayment).enable();
        } else {
          this.form.get(this.formField.finishPayment).setValue(null);
          this.form.get(this.formField.finishPayment).disable();
        }
      });

    this.form
      .get(this.formField.paymentType)
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.form.get(this.formField.startPayment).setValue(null);
        this.form.get(this.formField.finishPayment).setValue(null);
        this.form.get(this.formField.paymentDate).setValue(null);
      });
  }
}
