import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

import { ScreenService } from '../../../../../screen/screen.service';
import { FormField, FormValue, MatPeriod } from '../mat-period.models';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';

@Component({
  selector: 'epgu-constructor-mat-period-container',
  templateUrl: './mat-period-container.component.html',
  styleUrls: ['./mat-period-container.component.scss'],
})
export class MatPeriodContainerComponent implements OnInit {
  component$ = this.screenService.component$ as Observable<MatPeriod>;
  description$ = this.component$.pipe(map((component) => component.attrs.description));
  nextStepAction = NEXT_STEP_ACTION;
  balanceAmount: number;
  durationAmount: number;

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
  ) {}

  ngOnInit(): void {}

  updateState(formValue: FormValue): void {
    this.currentAnswersService.state = formValue;
    if (formValue[FormField.paymentType] === 'one') {
      const x = Object.entries(formValue).filter(
        ([key]) => ![FormField.startPayment, FormField.finishPayment].includes(key as FormField),
      );
      this.currentAnswersService.isValid = Object.entries(formValue)
        .filter(
          ([key]) => ![FormField.startPayment, FormField.finishPayment].includes(key as FormField),
        )
        .every(([_, value]) => value);
    } else {
      this.currentAnswersService.isValid = Object.values(formValue).every((value) => value);
    }

    this.updateDescription(
      formValue[FormField.amount],
      formValue[FormField.finishPayment]?.id,
      formValue[FormField.startPayment]?.id,
    );
  }

  private updateDescription(
    balanceAmount: string = '0',
    finishPayment: string | number = '0',
    startPayment: string | number = '0',
  ): void {
    const duration = parseFloat(finishPayment as string) - parseFloat(startPayment as string);
    this.balanceAmount = (parseFloat(balanceAmount) || 0) * (duration || 1);
    this.durationAmount = duration;
  }
}
