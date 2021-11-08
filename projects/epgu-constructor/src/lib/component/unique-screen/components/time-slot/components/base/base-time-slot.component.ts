import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

import {
  EventBusService,
  HttpCancelService,
  ModalService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { takeUntil } from 'rxjs/operators';

import { TimeSlotStateService } from '../../services/state/time-slot-state.service';
import { TimeSlotCalendarService } from '../../services/calendar/time-slot-calendar.service';
import { NEXT_STEP_ACTION } from '../../../../../../shared/constants/actions';
import { ScreenService } from '../../../../../../screen/screen.service';
import { EVENT_TIMESLOT_BOOK, EVENT_TIMESLOT_BOOK_RESULT, Slot } from '../../typings';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export abstract class BaseTimeSlotComponent implements OnDestroy, OnInit {
  months$ = this.state.months$;
  list$ = this.state.list$;
  slot$ = this.state.slot$;
  month$ = this.state.month$;
  day$ = this.state.day$;

  nextStepAction = NEXT_STEP_ACTION;
  id = this.screenService.component.id;

  constructor(
    public state: TimeSlotStateService,
    public calendar: TimeSlotCalendarService,
    public httpCancel: HttpCancelService,
    public screenService: ScreenService,
    public eventBus: EventBusService,
    public ngUnsubscribe$: UnsubscribeService,
    public modal: ModalService,
  ) {}

  changeMonthAction(month: string): void {
    this.state.setMonth(month);
  }

  changeDayAction(day: Date): void {
    if (this.state.day?.toISOString() === day.toISOString()) {
      this.state.clearDay();
    } else {
      this.state.setDay(day);
    }
  }

  changeSlotAction(slot: Slot): void {
    if (this.state.slot?.slotId === slot?.slotId) {
      this.state.clearSlot();
    } else {
      this.state.setSlot(slot);
      this.changeSlot(slot);
    }
  }

  setResult<T extends object>(data: T): void {
    this.state.setResult(data);
  }

  ngOnDestroy(): void {
    this.httpCancel.cancelPendingRequests();
  }
  ngOnInit(): void {
    this.eventBus
      .on(EVENT_TIMESLOT_BOOK)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((id: string) => this.book(id));
  }

  finish(id?: string): void {
    this.eventBus.emit(`${id}${EVENT_TIMESLOT_BOOK_RESULT}`);
  }

  abstract book(id?: string): void;

  abstract changeSlot(slot: Slot): void;

  abstract changeHaveUnlockedDaysAction(status: boolean): void;
}
