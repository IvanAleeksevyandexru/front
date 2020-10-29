import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil, takeWhile, tap } from 'rxjs/operators';
import { timer } from 'rxjs';

import { ConfirmInfoInterface } from '../models/confirm-info.interface';
import { TimerInterface } from '../models/timer.interface';
import { createTimer } from './confirm.helper';
import { ScreenService } from '../../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../../shared/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmComponent implements OnInit {
  @Output() nextStepEvent = new EventEmitter<string>();

  timer: TimerInterface;

  get value() {
    return this.screenService.componentValue as ConfirmInfoInterface;
  }

  constructor(private ngUnsubscribe$: UnsubscribeService, public screenService: ScreenService) {}

  ngOnInit(): void {
    this.timer = createTimer(this.getStartDate(), this.getFinishDate());
    this.startTimer();
  }

  nextStep(): void {
    this.nextStepEvent.emit(JSON.stringify({ isExpired: this.timer.progress === 0 }));
  }

  startTimer() {
    timer(this.timer.start - Date.now(), 1000)
      .pipe(
        takeWhile(() => this.timer.progress > 0),
        takeUntil(this.ngUnsubscribe$),
        tap(() => this.startTimerHandler()),
      )
      .subscribe();
  }

  startTimerHandler() {
    this.timer.offset =
      -((this.timer.completion - this.timer.progress + 1000) / this.timer.completion) *
      this.timer.circumference;
    this.timer.progress -= 1000;
    this.timer.time -= 1000;
  }

  private getStartDate() {
    return new Date(this.value.timer.start).getTime();
  }

  private getFinishDate() {
    return new Date(this.value.timer.finish).getTime();
  }
}
