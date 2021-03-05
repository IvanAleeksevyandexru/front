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

@Component({
  selector: 'epgu-constructor-mat-period-form',
  templateUrl: './mat-period-form.component.html',
  styleUrls: ['./mat-period-form.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatPeriodFormComponent implements OnInit {
  @Input() cachedValue: FormValue | null;
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
  ) {}

  ngOnInit(): void {
    this.initForm(this.cachedValue);
    this.durations = this.durationService.initDurations();
  }

  initForm(cachedValue: FormValue | null): void {
    this.form = this.fb.group({
      [this.formField.paymentType]: new FormControl(cachedValue[FormField.paymentType] || 'one'),
      [this.formField.amount]: new FormControl(cachedValue[FormField.amount] || null),
      [this.formField.startPayment]: new FormControl(cachedValue[FormField.startPayment] || null),
      [this.formField.finishPayment]: new FormControl(cachedValue[FormField.finishPayment] || null),
      [this.formField.paymentDate]: new FormControl(cachedValue[FormField.paymentDate] || null),
    });

    this.form.valueChanges
      .pipe(startWith({}), takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => {
        console.log(this.form.value);
        this.updateStateEvent.emit(value);
      });

    this.form
      .get(this.formField.startPayment)
      .valueChanges.pipe(
        startWith(this.form.get(this.formField.startPayment).value),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((date) => {
        if (date) {
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
