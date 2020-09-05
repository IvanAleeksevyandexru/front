import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil, takeWhile, tap } from 'rxjs/operators';
import { timer } from 'rxjs';

import { ConfirmMarriageInfoInterface } from '../models/confirm-marriage-info.interface';
import { UnsubscribeService } from '../../../../../services/unsubscribe/unsubscribe.service';
import { TimerInterface } from '../models/timer.interface';
import { createTimerForConfirmMarriage } from './confirm-marriage.helper';
import { DisplayInterface } from '../../../../../services/api/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-confirm-marriage',
  templateUrl: './confirm-marriage.component.html',
  styleUrls: ['./confirm-marriage.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmMarriageComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() data: DisplayInterface;
  @Output() nextStepEvent = new EventEmitter<void>();

  get marriageInfo() {
    return this.data.components[0].attrs as ConfirmMarriageInfoInterface;
  }

  timer: TimerInterface;

  constructor(private ngUnsubscribe$: UnsubscribeService) {}

  ngOnInit(): void {
    this.timer = createTimerForConfirmMarriage(
      this.getMarriageStartDate(),
      this.getMarriageFinishDate(),
    );
    this.startTimer();
  }

  nextStep(): void {
    this.nextStepEvent.emit();
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
    return new Date(this.marriageInfo.timer.start.value).getTime();
  }

  private getMarriageFinishDate() {
    return new Date(this.marriageInfo.timer.finish.value).getTime();
  }
}
