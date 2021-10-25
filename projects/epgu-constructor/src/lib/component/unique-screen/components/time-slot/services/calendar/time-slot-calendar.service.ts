import { Injectable } from '@angular/core';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs';
import { map, pluck, shareReplay, switchMapTo } from 'rxjs/operators';
import { ComponentRestrictionsDto } from '@epgu/epgu-constructor-types';
import { ScreenService } from '../../../../../../screen/screen.service';
import { DateTypeTypes } from '../../time-slot.const';

@Injectable()
export class TimeSlotCalendarService {
  haveUnlockedDays$$ = new BehaviorSubject<boolean>(true);

  set haveUnlockedDays(haveUnlockedDays: boolean) {
    this.haveUnlockedDays$$.next(haveUnlockedDays);
  }
  get haveUnlockedDays(): boolean {
    return this.haveUnlockedDays$$.getValue();
  }

  today$$ = new BehaviorSubject<null>(null);
  today$: Observable<Date> = this.today$$.pipe(
    switchMapTo(from(this.datesTools.getToday(true))),
    shareReplay(),
  );

  monthList = new BehaviorSubject<Set<string>>(new Set<string>());
  monthsRange$ = this.monthList.pipe(map((list) => Array.from(list).join(' — ')));

  refDate$ = combineLatest([
    this.today$,
    this.screenService.component$.pipe(pluck('attrs', 'dateType')),
    this.screenService.component$.pipe(pluck('attrs', 'refDate')),
  ]).pipe(
    map(([today, dateType, refDate]) => this.getRefDate(today, dateType as DateTypeTypes, refDate)),
  );

  restrictions$: Observable<ComponentRestrictionsDto> = this.screenService.component$.pipe(
    pluck('attrs', 'restrictions'),
    map((value) => (value ?? {}) as ComponentRestrictionsDto),
  );

  constructor(private screenService: ScreenService, private datesTools: DatesToolsService) {}

  getRefDate(today: Date, dateType: DateTypeTypes, refDate: string): Date {
    if (dateType === DateTypeTypes.TODAY) {
      return today;
    }

    if (dateType === DateTypeTypes.REF_DATE && refDate) {
      return new Date(refDate);
    }
    return null;
  }

  addMonth(month: string): void {
    this.monthList.next(this.monthList.getValue().add(month));
  }

  resetToday(): void {
    this.today$$.next(null);
  }
}
