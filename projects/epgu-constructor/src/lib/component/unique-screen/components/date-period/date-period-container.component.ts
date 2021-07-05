import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { DATE_STRING_DASH_FORMAT, DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { CachedAnswersDto, ComponentDto } from '@epgu/epgu-constructor-types';
import { ScreenService } from '../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { CachedAnswersService } from '../../../../shared/services/cached-answers/cached-answers.service';
import { DatePeriodFormState, DatePeriodFormValues, DatePeriodState } from './date-period.types';

@Component({
  selector: 'epgu-constructor-date-period-container',
  templateUrl: './date-period-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePeriodContainerComponent implements AfterViewInit {
  initialState$: Observable<DatePeriodFormValues> = combineLatest([
    this.screenService.component$,
    this.screenService.cachedAnswers$,
  ]).pipe(map(([component, cachedAnswers]) => this.getState(cachedAnswers, component)));

  private readonly defaultTime = 'T00:00:00.000Z';

  constructor(
    private changeDetection: ChangeDetectorRef,
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private cachedAnswersService: CachedAnswersService,
    private datesToolsService: DatesToolsService,
  ) {}

  ngAfterViewInit(): void {
    this.changeDetection.detectChanges();
  }

  updateState({ startDate, endDate, isValid }: DatePeriodFormState): void {
    this.currentAnswersService.isValid = isValid;

    const state = {
      startDate: this.datesToolsService.format(startDate, DATE_STRING_DASH_FORMAT),
      endDate: this.datesToolsService.format(endDate, DATE_STRING_DASH_FORMAT),
    };

    this.currentAnswersService.state = JSON.stringify(state);
  }

  private getState(cachedAnswers: CachedAnswersDto, component: ComponentDto): DatePeriodFormValues {
    const cache = this.cachedAnswersService.getCachedValueById(cachedAnswers, component.id);
    const datePeriodState = <DatePeriodState>JSON.parse(cache || null);

    return {
      startDate:
        datePeriodState && datePeriodState.startDate
          ? this.datesToolsService.parseISO(`${datePeriodState.startDate}${this.defaultTime}`)
          : new Date(),
      endDate:
        datePeriodState && datePeriodState.endDate
          ? this.datesToolsService.parseISO(`${datePeriodState.endDate}${this.defaultTime}`)
          : null,
    };
  }
}
