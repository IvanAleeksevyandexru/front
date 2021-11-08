import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { LockProvider } from '../../typings';

@Component({
  selector: 'epgu-constructor-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayComponent {
  @Input() isLocked: boolean;
  @Input() set day(day: Date) {
    this.day$$.next(day);
  }
  @Input() set today(today: Date) {
    this.today$$.next(today);
  }
  @Input() set selected(selected: Date) {
    this.selected$$.next(selected);
  }
  @Input() set firstDayOfMainSection(firstDayOfMainSection: Date) {
    this.firstDayOfMainSection$$.next(firstDayOfMainSection);
  }
  @Input() set daysInMainSection(daysInMainSection: number) {
    this.daysInMainSection$$.next(daysInMainSection);
  }
  @Input() set month(month: [number, number]) {
    this.month$$.next(month);
  }
  @Input() lockProvider = (() => true) as LockProvider;

  @Output() choose = new EventEmitter<Date>();

  day$$ = new BehaviorSubject<Date>(null);
  day$ = this.day$$.pipe(filter((day) => !!day));

  today$$ = new BehaviorSubject<Date>(null);
  today$ = this.today$$.pipe(filter((today) => !!today));

  selected$$ = new BehaviorSubject<Date>(null);
  selected$ = this.selected$$.asObservable();

  firstDayOfMainSection$$ = new BehaviorSubject<Date>(null);
  firstDayOfMainSection$ = this.firstDayOfMainSection$$.pipe(
    filter((firstDayOfMainSection) => !!firstDayOfMainSection),
  );

  daysInMainSection$$ = new BehaviorSubject<number>(null);
  daysInMainSection$ = this.daysInMainSection$$.pipe(
    filter((daysInMainSection) => !!daysInMainSection),
  );

  month$$ = new BehaviorSubject<[number, number]>(null);
  month$ = this.month$$.pipe(filter((month) => !!month));

  dayNumber$: Observable<number> = this.day$.pipe(
    map((day) => this.dateTools.getDate(day)),
    distinctUntilChanged(),
  );

  isPast$: Observable<boolean> = combineLatest([this.today$, this.day$]).pipe(
    map(([today, day]) => this.dateTools.differenceInCalendarDays(today, day) < 0),
    distinctUntilChanged(),
  );

  isToday$: Observable<boolean> = combineLatest([this.today$, this.day$]).pipe(
    map(([today, day]) => this.isToday(day, today)),
    distinctUntilChanged(),
  );

  isSelected$: Observable<boolean> = combineLatest([this.day$, this.selected$]).pipe(
    map(([day, selected]) => this.isSelected(day, selected)),
    distinctUntilChanged(),
  );

  isOutOfSection$: Observable<boolean> = combineLatest([
    this.day$,
    this.firstDayOfMainSection$,
    this.daysInMainSection$,
  ]).pipe(
    map(([day, firstDayOfMainSection, daysInMainSection]) =>
      this.dateTools.isDateOutOfSection(day, firstDayOfMainSection, daysInMainSection),
    ),
    distinctUntilChanged(),
  );

  isOutOfMonth$: Observable<boolean> = combineLatest([this.day$, this.month$]).pipe(
    map(([day, month]) => this.isDateOutOfMonth(day, month[1])),
    distinctUntilChanged(),
  );

  isVisible$: Observable<boolean> = combineLatest([this.isOutOfSection$, this.isOutOfMonth$]).pipe(
    map(([isOutOfSection, isOutOfMonth]) => isOutOfMonth && !isOutOfSection),
    distinctUntilChanged(),
  );

  constructor(private dateTools: DatesToolsService) {}

  isToday(date: Date, today: Date): boolean {
    return (
      date.getUTCFullYear() === today.getUTCFullYear() &&
      date.getUTCMonth() === today.getUTCMonth() &&
      date.getUTCDate() === today.getUTCDate()
    );
  }

  isSelected(date: Date, selected: Date): boolean {
    return this.dateTools.isSameDate(date, selected);
  }

  isDateOutOfMonth(date: Date, activeMonthNumber: number): boolean {
    return date && this.dateTools.getMonth(date) !== activeMonthNumber;
  }

  chooseAction(): void {
    if (this.isLocked) {
      return;
    }
    this.choose.emit(this.day$$.getValue());
  }
}
