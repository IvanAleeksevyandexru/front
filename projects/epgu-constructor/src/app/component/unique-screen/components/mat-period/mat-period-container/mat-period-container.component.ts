import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

import { ScreenService } from '../../../../../screen/screen.service';
import { FormField, FormValue, MatPeriod, PaymentType } from '../mat-period.models';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'epgu-constructor-mat-period-container',
  templateUrl: './mat-period-container.component.html',
  styleUrls: ['./mat-period-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatPeriodContainerComponent implements OnInit {
  component$ = this.screenService.component$ as Observable<MatPeriod>;
  description$ = this.component$.pipe(map((component) => component.attrs.description));
  cachedValue$: Observable<FormValue | null> = combineLatest([
    this.screenService.cachedAnswers$,
    this.component$,
  ]).pipe(
    map(([cash, component]) => {
      return JSON.parse(cash[component.id]?.value || '{}');
    }),
  );
  nextStepAction = NEXT_STEP_ACTION;
  balanceAmount: number;
  durationAmount: number;
  paymentType: PaymentType;

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
  ) {}

  ngOnInit(): void {}

  updateState(formValue: FormValue): void {
    this.currentAnswersService.state = formValue;
    this.currentAnswersService.isValid = this.isValidForm(formValue);
    this.paymentType = formValue[FormField.paymentType];

    this.updateDescription(
      formValue[FormField.amount],
      formValue[FormField.finishPayment]?.value,
      formValue[FormField.startPayment]?.value,
    );
  }

  private updateDescription(
    balanceAmount: null | string,
    finishPayment: null | number,
    startPayment: null | number,
  ): void {
    const x = parseFloat(balanceAmount?.replace(/ /g, '').replace(',', '.'));
    const duration = finishPayment - startPayment || null;
    this.balanceAmount = (x || 0) * (duration || 1);
    this.durationAmount = duration;
  }

  private isValidForm(formValue: FormValue): boolean {
    if (formValue[FormField.paymentType] === 'one') {
      return Object.entries(formValue)
        .filter(
          ([key]) => ![FormField.startPayment, FormField.finishPayment].includes(key as FormField),
        )
        .every(([_, value]) => value);
    }
    return Object.values(formValue).every((value) => value);
  }
}
