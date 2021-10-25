import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { map, pluck } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { ListItem } from '@epgu/ui/models/dropdown';
import { ScreenService } from '../../../../../../../screen/screen.service';

import { TimeSlotCalendarService } from '../../../services/calendar/time-slot-calendar.service';
import { MonthHideProvider } from '../../../../../../../shared/components/calendar/typings';

@Component({
  selector: 'epgu-constructor-time-slot-month',
  templateUrl: './time-slot-month.component.html',
  styleUrls: ['./time-slot-month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotMonthComponent {
  @Output() choose = new EventEmitter<string>();

  @Input() set months(months: string[]) {
    this.months$$.next(months);
  }

  @Input() set current(current: string) {
    this.current$$.next(current);
  }

  months$$ = new BehaviorSubject<string[]>(null);
  current$$ = new BehaviorSubject<string>(null);
  isMonthsRangeVisible$ = this.screenService.component$.pipe(
    pluck('attrs', 'isMonthsRangeVisible'),
  );

  range$ = this.calendar.monthsRange$;

  monthHideProvider$: Observable<MonthHideProvider> = combineLatest([
    this.calendar.refDate$.pipe(map((refDate) => this.datesTools.startOf(refDate, 'month'))),
    this.calendar.restrictions$,
  ]).pipe(
    map(
      ([refDate, restrictions]) =>
        ((date) =>
          this.datesTools.checkDateRestrictions(
            restrictions,
            refDate,
            date,
            'month',
          )) as MonthHideProvider,
    ),
  );

  constructor(
    private screenService: ScreenService,
    private datesTools: DatesToolsService,
    private calendar: TimeSlotCalendarService,
  ) {}

  chooseAction(item: ListItem): void {
    this.choose.emit(item.id as string);
  }
}
