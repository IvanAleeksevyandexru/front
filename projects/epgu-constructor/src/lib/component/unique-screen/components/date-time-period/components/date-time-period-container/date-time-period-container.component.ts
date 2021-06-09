import { Component, ChangeDetectionStrategy } from '@angular/core';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

import { ScreenService } from '../../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { DateTimePeriodState } from '../../date-time-period.types';
import { CachedAnswersService } from '../../../../../../shared/services/cached-answers/cached-answers.service';

@Component({
  selector: 'epgu-constructor-date-time-period-container',
  templateUrl: './date-time-period-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimePeriodContainerComponent {
  initialState$: Observable<DateTimePeriodState | null> = combineLatest([
    this.screenService.component$,
    this.screenService.cachedAnswers$,
  ]).pipe(
    map(([component, cachedAnswers]) => {
      const cache = this.cachedAnswersService.getCachedValueById(cachedAnswers, component.id);
      const result = this.parseValue<DateTimePeriodState | null>(cache, null);

      return {
        startDateTime: result ? result.startDateTime : null,
        endDateTime: result ? result.endDateTime : null,
      };
    }),
  );

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private cachedAnswersService: CachedAnswersService,
  ) {}

  updateState(state: DateTimePeriodState): void {
    this.currentAnswersService.state = JSON.stringify(state);
  }

  private parseValue<T>(value: string, defaultValue: string): T {
    return JSON.parse(value || defaultValue);
  }
}
