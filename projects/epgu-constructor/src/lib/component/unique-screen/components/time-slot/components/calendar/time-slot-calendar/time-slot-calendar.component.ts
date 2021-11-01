import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { SectionType } from '@epgu/epgu-constructor-types';
import { TimeSlotCalendarService } from '../../../services/calendar/time-slot-calendar.service';
import { ScreenService } from '../../../../../../../screen/screen.service';
import { LockProvider } from '../../../../../../../shared/components/calendar/typings';

@Component({
  selector: 'epgu-constructor-time-slot-calendar',
  templateUrl: './time-slot-calendar.component.html',
  styleUrls: ['./time-slot-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSlotCalendarComponent {
  @Output() haveUnlockedDays = new EventEmitter<boolean>();
  @Output() choose = new EventEmitter<Date>();

  @Input() set currentDay(day: Date) {
    this.day$$.next(day);
  }

  @Input() set currentMonth(month: string) {
    this.month$$.next(month);
  }

  @Input() set lockProvider(provider: LockProvider) {
    this.lockProvider$$.next(provider);
  }

  startSection$: Observable<SectionType> = this.screenService.component$.pipe(
    pluck('attrs', 'startSection'),
  );
  daysToShow$: Observable<number> = this.screenService.component$.pipe(
    pluck('attrs', 'daysToShow'),
  );
  today$ = this.calendar.today$;

  lockProvider$$ = new BehaviorSubject<LockProvider>(null);
  day$$ = new BehaviorSubject<Date>(null);
  month$$ = new BehaviorSubject<string>(null);

  constructor(private screenService: ScreenService, private calendar: TimeSlotCalendarService) {}

  addMonthRangeAction(month: string): void {
    this.calendar.addMonth(month);
  }

  chooseAction(date: Date): void {
    this.choose.emit(date);
  }

  haveNotUnlockedDaysAction(status: boolean): void {
    this.haveUnlockedDays.emit(!status);
  }
}
