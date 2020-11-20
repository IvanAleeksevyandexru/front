import { Component, EventEmitter, Input, Output } from '@angular/core';

import { timer } from 'rxjs';
import { takeUntil, takeWhile, tap } from 'rxjs/operators';
import {
  TimerComponentBase,
  TimerInterface,
  TimerLabelSection,
  TimerValueInterface,
} from './timer.interface';
import { createTimer, isWarning } from './timer.helper';
import { ScreenService } from '../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ComponentDtoAction } from '../../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {
  @Output() nextStepEvent = new EventEmitter<string>();

  @Input() value: TimerValueInterface;
  private componentBase: TimerComponentBase;
  @Input() set data(componentBase: TimerComponentBase) {
    this.componentBase = componentBase;
    this.actionButtons = componentBase.attrs?.actions ? componentBase.attrs.actions : [];

    this.timer = createTimer(
      this.getStartDate(),
      this.getFinishDate(),
      this.componentBase.attrs?.timerRules?.warningColorFromTime,
    );
    if (this.data.attrs?.timerRules?.labels?.length) {
      this.sortLabelsByTime();
    }
    this.startTimer();
  }
  get data(): TimerComponentBase {
    return this.componentBase;
  }
  label: string;
  timer: TimerInterface;
  actionButtons: ComponentDtoAction[] = [];

  private secondInMiliSeconds = 1000;

  constructor(private ngUnsubscribe$: UnsubscribeService, public screenService: ScreenService) {}

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

  /**
   * Обработка таймера
   */
  startTimerHandler() {
    const time = this.timer.time - this.secondInMiliSeconds;
    this.timer.isWarning = isWarning(
      time,
      this.timer.finish,
      this.data.attrs?.timerRules?.warningColorFromTime,
    );
    this.timer.isFinish = time <= 1000;
    this.timer.time = time;
    this.label = this.componentBase.label;
    if (this.data.attrs?.timerRules?.labels?.length) {
      this.data.attrs.timerRules.labels.forEach((timerRule) => this.setLabelFromRule(timerRule));
    }
  }

  /**
   * Сортирует правила показа заголовков в зависимости от правил препримения времени. От большего к меньшему
   * @private
   */
  private sortLabelsByTime() {
    this.data.attrs.timerRules.labels = this.data.attrs.timerRules.labels.sort((a, b) => {
      if (a.fromTime > b.fromTime) {
        return -1;
      }
      if (a.fromTime < b.fromTime) {
        return 1;
      }
      return 0;
    });
  }

  /**
   * Устанавливает заголовок в зависимости от оставшегося времени
   * @param timerRule - правило применения заголовка
   * @private
   */
  private setLabelFromRule(timerRule: TimerLabelSection) {
    if (this.timer.time <= timerRule.fromTime * 1000) {
      this.label = timerRule.label;
    }
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

  nextStep(): void {
    this.nextStepEvent.emit(JSON.stringify({ isExpired: this.timer.time === 0 }));
  }
}
