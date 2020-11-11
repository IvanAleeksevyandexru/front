import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil, takeWhile, tap } from 'rxjs/operators';
import { timer } from 'rxjs';

import { ConfirmInfoInterface } from '../models/confirm-info.interface';
import { TimerInterface } from '../models/timer.interface';
import { createTimer } from './confirm.helper';
import { ScreenService } from '../../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmComponent implements OnInit {
  @Output() nextStepEvent = new EventEmitter<string>();

  private secondInMiliSeconds = 1000;
  replayButton: string;
  needTimer = true;
  timer: TimerInterface;

  /**
   * Возвращает текущее значение для инициализации таймера
   */
  get value(): ConfirmInfoInterface {
    return this.screenService.componentValue as ConfirmInfoInterface;
  }

  constructor(private ngUnsubscribe$: UnsubscribeService, public screenService: ScreenService) {}

  ngOnInit(): void {
    this.timer = createTimer(
      this.getStartDate(),
      this.getFinishDate(),
      this.value.timer.warningTime,
    );
    this.startTimer();
  }

  nextStep(): void {
    this.nextStepEvent.emit(JSON.stringify({ isExpired: this.timer.time === 0 }));
  }

  /**
   * Стартует работу таймера
   */
  startTimer() {
    timer(this.timer.start - Date.now(), this.secondInMiliSeconds)
      .pipe(
        takeWhile(() => this.timer.time - this.secondInMiliSeconds >= -this.secondInMiliSeconds),
        takeUntil(this.ngUnsubscribe$),
        tap(() => this.startTimerHandler()),
      )
      .subscribe();
  }

  startTimerHandler() {
    const time = this.timer.time - this.secondInMiliSeconds;
    this.timer.isWarning = time <= this.value.timer.warningTime;
    this.timer.isFinish = time === 0;
    this.timer.time = time;
  }

  /**
   * Возвращает дату старта таймера в милисекундах
   * @private
   */
  private getStartDate(): number {
    return new Date(this.value.timer.start).getTime();
  }

  /**
   * Возвращает дату завершения таймера в милисекундах
   * @private
   */
  private getFinishDate(): number {
    return new Date(this.value.timer.finish).getTime();
  }
}
