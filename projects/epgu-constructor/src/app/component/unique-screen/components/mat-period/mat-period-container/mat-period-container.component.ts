import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { combineLatest } from 'rxjs';

import { ScreenService } from '../../../../../screen/screen.service';
import { FormField, FormValue, MatPeriod, PaymentType } from '../mat-period.models';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';

@Component({
  selector: 'epgu-constructor-mat-period-container',
  templateUrl: './mat-period-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatPeriodContainerComponent implements AfterViewInit {
  component$ = (this.screenService.component$ as unknown) as Observable<MatPeriod>;
  description$ = this.component$.pipe(map((component) => component.attrs.description));
  cachedValue$: Observable<FormValue['data']> = combineLatest([
    this.screenService.cachedAnswers$,
    this.component$,
  ]).pipe(
    map(([cash, component]) => {
      const parsedValue = JSON.parse(cash[component.id]?.value || '{}') as FormValue['data'];
      if (parsedValue[FormField.paymentType] && parsedValue[FormField.paymentType] !== 'one') {
        const paymentDate = parseFloat(parsedValue[FormField.paymentDate].split('.')[0]).toFixed(0);
        return {
          ...parsedValue,
          paymentDate,
        };
      }
      return parsedValue;
    }),
  );
  components$ = this.component$.pipe(map((component) => component.attrs.components));
  nextStepAction = NEXT_STEP_ACTION;
  balanceAmount: number;
  durationAmount: number;
  paymentType: PaymentType;

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  updateState({ data, isValid }: FormValue): void {
    this.currentAnswersService.state = data;
    this.currentAnswersService.isValid = this.isValidForm(data) && isValid;
    this.paymentType = data[FormField.paymentType];

    this.updateDescription(
      data[FormField.amount],
      data[FormField.finishPayment]?.value,
      data[FormField.startPayment]?.value,
    );
  }

  private updateDescription(
    balanceAmount: null | string,
    finishPayment: null | number,
    startPayment: null | number,
  ): void {
    const parsedBalanceAmount = parseFloat(balanceAmount?.replace(/ /g, '').replace(',', '.'));
    const duration = finishPayment + 1 - startPayment || null;
    this.balanceAmount = (parsedBalanceAmount || 0) * (duration || 1);
    this.durationAmount = duration;
  }

  private isValidForm(formValue: FormValue['data']): boolean {
    if (formValue[FormField.paymentType] === 'one') {
      return (
        Object.entries(formValue)
          .filter(
            ([key]) =>
              ![FormField.startPayment, FormField.finishPayment].includes(key as FormField),
          )
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .every(([_, value]) => value)
      );
    }
    return Object.values(formValue).every((value) => value);
  }
}
