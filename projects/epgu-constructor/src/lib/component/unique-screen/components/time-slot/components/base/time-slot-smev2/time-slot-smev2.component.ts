import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  DATE_TIME_STRING_FULL,
  DatesToolsService,
  EventBusService,
  HttpCancelService,
  ModalService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { Observable, Subscription } from 'rxjs';
import { BaseTimeSlotComponent } from '../base-time-slot.component';
import { TimeSlotCalendarService } from '../../../services/calendar/time-slot-calendar.service';

import { TimeSlotStateService } from '../../../services/state/time-slot-state.service';

import { TimeSlotSmev2Service } from '../../../services/smev2/time-slot-smev2.service';

import { ScreenService } from '../../../../../../../screen/screen.service';
import { ActionService } from '../../../../../../../shared/directives/action/action.service';
import { getConfirmModalParams, templateList } from './data';
import { Slot } from '../../../typings';

import { TimeSlotErrorService } from '../../../services/error/time-slot-error.service';
import { LockProvider } from '../../../../../../../shared/components/calendar/typings';

@Component({
  selector: 'epgu-constructor-time-slot-smev2',
  templateUrl: './time-slot-smev2.component.html',
  styleUrls: ['./time-slot-smev2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class TimeSlotSmev2Component extends BaseTimeSlotComponent implements OnInit {
  lockProvider$: Observable<LockProvider> = this.calendar.today$.pipe(
    map(
      (today) =>
        ((day: Date) =>
          this.datesTools.isAfter(this.datesTools.addDays(today, 1), day)) as LockProvider,
    ),
  );

  listLoader: Subscription = this.day$
    .pipe(
      switchMap((date: Date) => (!date ? [] : this.data.getList(date).pipe())),
      tap((list: Slot[]) => {
        this.calendar.haveUnlockedDays = list.length > 0;
      }),
      tap((list: Slot[]) => this.state.setList(list)),
      takeUntil(this.ngUnsubscribe$),
    )
    .subscribe();

  monthsLoader = this.calendar.today$
    .pipe(
      map((today) => this.datesTools.getMonthListByYear(today)),
      tap((months) => {
        this.state.months = months;
      }),
      takeUntil(this.ngUnsubscribe$),
    )
    .subscribe();

  constructor(
    public state: TimeSlotStateService,
    public calendar: TimeSlotCalendarService,
    public httpCancel: HttpCancelService,
    public datesTools: DatesToolsService,
    public ngUnsubscribe$: UnsubscribeService,
    public data: TimeSlotSmev2Service,
    public modal: ModalService,
    public screenService: ScreenService,
    public actionService: ActionService,
    public eventBus: EventBusService,
    public error: TimeSlotErrorService,
  ) {
    super(state, calendar, httpCancel, screenService, eventBus, ngUnsubscribe$, modal);
  }

  ngOnInit(): void {
    this.error.setAllTemplates(templateList);
    super.ngOnInit();
  }

  changeSlot(slot: Slot): void {
    this.setResult(this.data.getCacheBySlot(slot));
  }

  changeHaveUnlockedDaysAction(status: boolean): void {
    this.calendar.haveUnlockedDays = status;
  }

  book(id?: string): void {
    this.state.showModal(
      getConfirmModalParams(
        this.datesTools.format(this.state.slot.slotTime, DATE_TIME_STRING_FULL),
        () => this.finish(id),
      ),
    );
  }
}
