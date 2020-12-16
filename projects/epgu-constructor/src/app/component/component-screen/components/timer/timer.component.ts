import { Component, EventEmitter, Input, Output } from '@angular/core';
import { timer } from 'rxjs';
import { takeUntil, takeWhile, tap } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../../screen/screen.service';
import { createTimer, isWarning } from './timer.helper';
import {
  TimerComponentBase,
  TimerComponentDtoAction,
  TimerInterface,
  TimerLabelSection,
} from './timer.interface';

@Component({
  selector: 'epgu-constructor-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {
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
      this.setActionsButtons();
    }
    this.startTimer();
  }
  @Output() nextStepEvent = new EventEmitter<string>();

  public componentBase: TimerComponentBase;
  get data(): TimerComponentBase {
    return this.componentBase;
  }
  label: string;
  timer: TimerInterface;
  showTimer = true;
  actionButtons: TimerComponentDtoAction[] = [];

  private hasLabels = false;
  private hasButtons = false;
  private oneSecond = 1000;

  constructor(private ngUnsubscribe$: UnsubscribeService, public screenService: ScreenService) {}

  /**
   * Стартует работу таймера
   */
  startTimer(): void {
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
  startTimerHandler(): void {
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
    if (this.data?.attrs?.timerRules?.hideTimerFrom !== undefined) {
      this.checkHideTimer();
    }
  }

  nextStep(): void {
    this.nextStepEvent.emit(JSON.stringify({ isExpired: this.timer.time === 0 }));
  }

  /**
   * Проверяет нужно ли прятать таймер
   * @private
   */
  private checkHideTimer(): void {
    if (!this.data.attrs.timerRules.hideTimerFrom && this.timer.isFinish) {
      this.showTimer = false;
    } else {
      this.showTimer = this.timer.time > this.data.attrs.timerRules.hideTimerFrom * this.oneSecond;
    }
  }

  /**
   * Устанавливает кнопки которые будут отображаться
   * @private
   */
  private setActionsButtons(): void {
    this.actionButtons = [];
    this.data.attrs.timerRules.actions.forEach((timerRule: TimerComponentDtoAction) =>
      this.setButtonFromRule(timerRule),
    );
  }

  /**
   * Сортирует правила показа заголовков в зависимости от правил препримения времени. От большего к меньшему
   * @private
   */
  private sortLabelsByTime(): void {
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
  private setLabelFromRule(timerRule: TimerLabelSection): void {
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
  private setButtonFromRule(timerButton: TimerComponentDtoAction): void {
    const { time } = this.timer;
    const { fromTime } = timerButton;
    const { toTime } = timerButton;
    if (fromTime === undefined && toTime === undefined) {
      this.actionButtons.push(timerButton);
    } else if (fromTime && toTime) {
      if (time <= fromTime * this.oneSecond && time >= toTime * this.oneSecond) {
        this.actionButtons.push(timerButton);
      }
    } else if (fromTime && time <= fromTime * this.oneSecond) {
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
    return new Date(this.data.attrs.startTime).getTime();
  }

  /**
   * Возвращает дату завершения таймера в милисекундах
   * @private
   */
  private getFinishDate(): number {
    return new Date(this.data.attrs.expirationTime).getTime();
  }
}
