import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import { ScreenService } from '../../../../../screen/screen.service';
import { UnusedPaymentInterface } from '../unused-payment.interface';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';
import { CachedAnswersService } from '../../../../../shared/services/cached-answers/cached-answers.service';

@Component({
  selector: 'epgu-constructor-unused-payments-container',
  templateUrl: './unused-payments-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnusedPaymentsContainerComponent {
  nextStepAction = NEXT_STEP_ACTION;

  unusedPaymentsList$ = this.screenService.component$.pipe(
    map((component) => this.parseValue<UnusedPaymentInterface[]>(component.value, '[]')),
  );
  selectedPayment$ = combineLatest([
    this.screenService.component$,
    this.screenService.cachedAnswers$,
  ]).pipe(
    map(([component, cachedAnswers]) => {
      const cache = this.cachedAnswersService.getCachedValueById(cachedAnswers, component.id);
      return this.parseValue<UnusedPaymentInterface>(cache, null);
    }),
  );

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    public cachedAnswersService: CachedAnswersService,
  ) {}

  parseValue<T>(value: string, defaultValue: string): T {
    return JSON.parse(value || defaultValue);
  }

  updateState(unusedPayment: UnusedPaymentInterface): void {
    this.currentAnswersService.state = JSON.stringify(unusedPayment);
  }
}
