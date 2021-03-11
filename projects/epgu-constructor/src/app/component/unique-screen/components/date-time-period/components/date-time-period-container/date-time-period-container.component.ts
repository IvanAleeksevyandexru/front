import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
// eslint-disable-next-line import/no-cycle
import { ScreenService } from '../../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { NEXT_STEP_ACTION } from '../../../../../../shared/constants/actions';
import { DateTimePeriodState } from '../../date-time-period.types';
// eslint-disable-next-line import/no-cycle
import { CachedAnswersService } from '../../../../../../shared/services/cached-answers/cached-answers.service';

@Component({
  selector: 'epgu-constructor-date-time-period-container',
  templateUrl: './date-time-period-container.component.html',
  styleUrls: ['./date-time-period-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class DateTimePeriodContainerComponent implements OnInit {
  // data$: Observable<DisplayDto> = this.screenService.display$;

  initialState: DateTimePeriodState | null = null;

  nextStepAction = NEXT_STEP_ACTION;

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    private cachedAnswersService: CachedAnswersService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    combineLatest([this.screenService.component$, this.screenService.cachedAnswers$])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(([component, cachedAnswers]) => {
        const cache = this.cachedAnswersService.getCachedValueById(cachedAnswers, component.id);
        const result = this.parseValue<DateTimePeriodState>(cache, null);

        this.initialState = {
          startDateTime: result ? result.startDateTime : null,
          endDateTime: result ? result.endDateTime : null,
        };

        this.cdr.markForCheck();
      });
  }

  updateState(state: DateTimePeriodState): void {
    this.currentAnswersService.state = JSON.stringify(state);
  }

  private parseValue<T>(value: string, defaultValue: string): T {
    return JSON.parse(value || defaultValue);
  }
}
