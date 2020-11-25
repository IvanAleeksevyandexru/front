import { Component, EventEmitter, Input, Output } from '@angular/core';

import { timer } from 'rxjs';
import { takeUntil, takeWhile, tap } from 'rxjs/operators';
import {
  TimerComponentBase,
  TimerComponentDtoAction,
  TimerInterface,
  TimerLabelSection,
  TimerValueInterface,
} from './timer.interface';
import { createTimer, isWarning } from './timer.helper';
import { ScreenService } from '../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';

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
    this.hasLabels = this.data.attrs?.timerRules?.labels?.length > 0;
    this.hasButtons = this.data.attrs?.timerRules?.actions?.length > 0;

    this.timer = createTimer(
      this.getStartDate(),
      this.getFinishDate(),
      this.componentBase.attrs?.timerRules?.warningColorFromTime,
    );
    if (this.hasLabels) {
      this.sortLabelsByTime();
    }
    if (this.hasButtons) {
      this.prepareActionsButtons();
      this.setActionsButtons();
    }
    this.startTimer();
  }
  get data(): TimerComponentBase {
    return this.componentBase;
  }
  label: string;
  timer: TimerInterface;
  actionButtons: TimerComponentDtoAction[] = [];

  private hasLabels = false;
  private hasButtons = false;
  private oneSecond = 1000;

  constructor(private ngUnsubscribe$: UnsubscribeService, public screenService: ScreenService) {}

  /**
   * Стартует работу таймера
   */
  startTimer() {
    timer(this.timer.start - Date.now(), this.oneSecond)
      .pipe(
        takeWhile(() => this.timer.time - this.oneSecond >= -this.oneSecond),
        takeUntil(this.ngUnsubscribe$),
        tap(() => this.startTimerHandler()),
      )
      .subscribe();
  }

  /**
   * Обработка таймера
   */
  startTimerHandler() {
    const time = this.timer.time - this.oneSecond;
    this.timer.isWarning = isWarning(
      time,
      this.timer.finish,
      this.data.attrs?.timerRules?.warningColorFromTime,
    );
    this.timer.isFinish = time <= this.oneSecond;
    this.timer.time = time;
    this.label = this.componentBase.label;
    if (this.hasLabels) {
      this.data.attrs.timerRules.labels.forEach((timerRule: TimerLabelSection) =>
        this.setLabelFromRule(timerRule),
      );
    }
    if (this.hasButtons) {
      this.setActionsButtons();
    }
  }

  /**
   * Устанавливает кнопки которые будут отображаться
   * @private
   */
  private setActionsButtons() {
    this.actionButtons = [];
    this.data.attrs.timerRules.actions.forEach((timerRule: TimerComponentDtoAction) =>
      this.setButtonFromRule(timerRule),
    );
  }

  /**
   * Подготавливает кнопки смотря обязательные поля
   * @private
   */
  private prepareActionsButtons() {
    this.data.attrs.timerRules.actions = this.data.attrs.timerRules.actions.map((button) => {
      if (button.fromTime === undefined) {
        // eslint-disable-next-line no-param-reassign
        button.fromTime = 0;
      }
      return button;
    });
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
    if (timerRule.fromTime && this.timer.time <= timerRule.fromTime * this.oneSecond) {
      this.label = timerRule.label;
    } else if (this.timer.isFinish) {
      this.label = timerRule.label;
    }
  }

  /**
   * Устанавливает кнопку в зависимости от оставшетаймере
   * @private времени
   * @param timerButton - кнопка для отображения в
   */
  private setButtonFromRule(timerButton: TimerComponentDtoAction) {
    const { time } = this.timer;
    if (timerButton.fromTime && timerButton.toTime) {
      if (
        time <= timerButton.fromTime * this.oneSecond &&
        time >= timerButton.toTime * this.oneSecond
      ) {
        this.actionButtons.push(timerButton);
      }
    } else if (timerButton.fromTime && time <= timerButton.fromTime * this.oneSecond) {
      this.actionButtons.push(timerButton);
    } else if (this.timer.isFinish) {
      this.actionButtons.push(timerButton);
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
