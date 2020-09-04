import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil, takeWhile, tap } from 'rxjs/operators';
import { timer } from 'rxjs';

import { DisplayInterface } from '../../../../../../interfaces/epgu.service.interface';
import { ConfirmMarriageInfoInterface } from '../models/confirm-marriage-info.interface';
import { UnsubscribeService } from '../../../../../services/unsubscribe/unsubscribe.service';
import { TimerInterface } from '../models/timer.interface';

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
    this.timer = this.createTimer(
      new Date(this.marriageInfo.timer.start.value).getTime(),
      new Date(this.marriageInfo.timer.finish.value).getTime(),
    );
    this.startTimer();
  }

  nextStep(): void {
    this.nextStepEvent.emit();
  }

  createTimer(start: number, finish: number): TimerInterface {
    const now = Date.now();

    const isCorrectTime = finish - now > 0;

    const time = isCorrectTime ? finish - now : 0;

    const completion = finish - now - (start - now);
    const progress = isCorrectTime ? completion - (now - start) : 0;

    const size = 93;
    const strokeWidth = 3;
    const radius = size / 2 - strokeWidth / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    const offset = -((completion - progress) / completion) * circumference;

    return {
      progress,
      completion,
      size,
      strokeWidth,
      radius,
      center,
      circumference,
      offset,
      time,
      start,
      finish,
    };
  }

  startTimer() {
    timer(this.timer.start - Date.now(), 1000)
      .pipe(
        takeWhile(() => this.timer.progress > 0),
        takeUntil(this.ngUnsubscribe$),
        tap(() => {
          this.timer.offset =
            -((this.timer.completion - this.timer.progress + 1000) / this.timer.completion) *
            this.timer.circumference;
          this.timer.progress -= 1000;
          this.timer.time -= 1000;
        }),
      )
      .subscribe();
  }

  isTimeCorrect() {
    return this.timer.start - Date.now() > 0 || this.timer.finish - Date.now() < 0;
  }
}
