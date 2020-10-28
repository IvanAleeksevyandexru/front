import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil, takeWhile, tap } from 'rxjs/operators';
import { timer } from 'rxjs';

import { ConfirmMarriageInfoInterface } from '../models/confirm-marriage-info.interface';
import { UnsubscribeService } from '../../../../../shared/services/unsubscribe/unsubscribe.service';
import { TimerInterface } from '../models/timer.interface';
import { createTimerForConfirmMarriage } from './confirm-marriage.helper';
import { ScreenService } from '../../../../screen.service';

@Component({
  selector: 'epgu-constructor-confirm-marriage',
  templateUrl: './confirm-marriage.component.html',
  styleUrls: ['./confirm-marriage.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmMarriageComponent implements OnInit {
  @Output() nextStepEvent = new EventEmitter<string>();

  timer: TimerInterface;

  get value() {
    return this.screenService.componentValue as ConfirmMarriageInfoInterface;
  }

  constructor(private ngUnsubscribe$: UnsubscribeService, public screenService: ScreenService) {}

  ngOnInit(): void {
    this.timer = createTimerForConfirmMarriage(
      this.getMarriageStartDate(),
      this.getMarriageFinishDate(),
    );
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

  isTimeCorrect() {
    return this.timer.start - Date.now() > 0 || this.timer.finish - Date.now() < 0;
  }

  startTimerHandler() {
    this.timer.offset =
      -((this.timer.completion - this.timer.progress + 1000) / this.timer.completion) *
      this.timer.circumference;
    this.timer.progress -= 1000;
    this.timer.time -= 1000;
  }

  private getMarriageStartDate() {
    return new Date(this.value.timer.start).getTime();
  }

  private getMarriageFinishDate() {
    return new Date(this.value.timer.finish).getTime();
  }
}
