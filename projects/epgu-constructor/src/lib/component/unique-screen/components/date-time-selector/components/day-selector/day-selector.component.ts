import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DatesToolsService, UnsubscribeService, weekDaysAbbr } from '@epgu/epgu-constructor-ui-kit';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { SectionType } from '@epgu/epgu-constructor-types';

export type LockProvider = (
  day: Date,
  firstDayOfMainSection: Date,
  daysInMainSection: number,
) => boolean;

export interface Day {
  date: Date;
  locked: boolean;
}

@Component({
  selector: 'epgu-constructor-day-selector',
  templateUrl: './day-selector.component.html',
  styleUrls: ['./day-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class DaySelectorComponent {
  @Input() set today(date: Date) {
    this.today$$.next(date);
  }

  @Input() selected: Date;
  @Input() set lockProvider(provider: LockProvider) {
    this.lockProvider$$.next(provider);
  }
  @Input() namesDaysWeek: string[] = weekDaysAbbr;
  @Input() set startSection(section: SectionType) {
    this.startSection$$.next(section);
  }
  @Input() set month(month: string) {
    this.month$$.next(month);
  }
  @Input() set daysToShow(days: number) {
    this.daysToShow$$.next(days);
  }
  @Output() choose = new EventEmitter<Date>();
  @Output() monthChanged = new EventEmitter<string>();
  @Output() notExistsAvailable = new EventEmitter<boolean>();

  lockProvider$$ = new BehaviorSubject<LockProvider>(null);
  lockProvider$ = this.lockProvider$$.pipe(filter((value) => !!value));

  today$$ = new BehaviorSubject<Date>(null);
  today$ = this.today$$.pipe(filter((today) => !!today));
  startSection$$ = new BehaviorSubject<SectionType>(SectionType.normal);
  month$$ = new BehaviorSubject<string>(null);
  daysToShow$$ = new BehaviorSubject<number>(null);

  month$ = this.month$$.pipe(
    filter((value) => !!value),
    map((month) => month.split('-').map(Number)),
    map((month) => [month[0], month[1] - 1] as [number, number]),
    distinctUntilChanged(),
  );

  firstDayOfMainSection$ = combineLatest([this.startSection$$, this.today$, this.month$]).pipe(
    map(([section, today, month]) =>
      section === SectionType.today
        ? today
        : this.dateTools.setCalendarDate(today, month[0], month[1], 1),
    ),
    distinctUntilChanged(),
  );
  daysInMainSection$ = combineLatest([this.daysToShow$$, this.firstDayOfMainSection$]).pipe(
    map(
      ([daysToShow, firstDayOfMainSection]) =>
        daysToShow ?? this.dateTools.getDaysInMonth(firstDayOfMainSection),
    ),
    distinctUntilChanged(),
  );

  days$: Observable<Day[][]> = combineLatest([
    this.firstDayOfMainSection$,
    this.daysInMainSection$,
    this.lockProvider$,
  ]).pipe(
    map(([firstDayOfMainSection, daysInMainSection]) =>
      this.createDays(firstDayOfMainSection, daysInMainSection),
    ),
    distinctUntilChanged(),
    shareReplay(),
  );

  notExistsAvailable$$ = new BehaviorSubject<boolean>(null);

  notExistsAvailable$ = this.notExistsAvailable$$
    .pipe(
      filter((status) => status !== null),
      tap((value) => this.notExistsAvailable.emit(value)),
      takeUntil(this.ngUnsubscribe$),
    )
    .subscribe();

  constructor(private dateTools: DatesToolsService, private ngUnsubscribe$: UnsubscribeService) {}

  createDays(firstDayOfMainSection: Date, daysInMainSection: number): Day[][] {
    const firstDate = this.dateTools.startOfISOWeek(firstDayOfMainSection);
    const lastDate = this.dateTools.endOfISOWeek(
      this.dateTools.add(firstDayOfMainSection, daysInMainSection - 1, 'days'),
    );
    const totalDays = this.dateTools.differenceInCalendarDays(firstDate, lastDate);
    let date: Date = firstDate;
    let week = 0;
    const result: Day[][] = [[]];
    let notExistsAvailable = true;

    for (let i = 0; i <= totalDays; i += 1) {
      if (result[week].length && result[week].length % 7 === 0) {
        week += 1;
        result.push([]);
      }
      const locked = this.isLocked(date, firstDayOfMainSection, daysInMainSection);
      if (!locked) {
        notExistsAvailable = false;
      }
      result[week].push({
        locked,
        date,
      });
      if (!this.dateTools.isDateOutOfSection(date, firstDayOfMainSection, daysInMainSection)) {
        const monthName = this.dateTools.format(date, 'LLLL');
        this.monthChanged.emit(monthName.charAt(0).toUpperCase() + monthName.slice(1));
      }
      date = this.dateTools.add(date, 1, 'days');
    }
    this.notExistsAvailable$$.next(notExistsAvailable);
    return result;
  }

  isLocked(day: Date, firstDayOfMainSection: Date, daysInMainSection: number): boolean {
    return (
      this.dateTools.isDateOutOfSection(day, firstDayOfMainSection, daysInMainSection) ||
      this.lockProvider$$.getValue()(day, firstDayOfMainSection, daysInMainSection)
    );
  }

  chooseAction(day: Date): void {
    this.choose.emit(day);
  }
}
