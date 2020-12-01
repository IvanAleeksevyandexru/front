import { ComponentBase } from '../../../../screen/screen.types';
import { ComponentDtoAction } from '../../../../form-player/services/form-player-api/form-player-api.types';

/**
 * Интерфейс таймера
 */
export interface TimerInterface {
  isWarning: boolean;
  isFinish: boolean;
  time: number;
  start: number;
  finish: number;
}

/**
 * Секция сведения о заголовка исходя из вмерени
 */
export interface TimerLabelSection{
  label: string;
  fromTime: number;
}

/**
 * Интерфейс для кнопки таймера с последующим переходом
 */
export interface TimerComponentDtoAction extends ComponentDtoAction{
  fromTime?: number;
  toTime?: number;
}

/**
 * Правила для таймера
 */
interface TimerRules{
  hideTimerFrom?: number,
  warningColorFromTime?: number,
  labels?: TimerLabelSection[],
  actions?: TimerComponentDtoAction[],
}

/**
 * Входящие данные для компонента таймер
 */
export interface TimerComponentBase extends ComponentBase{
  attrs: {
    startTime: string,
    expirationTime: string,
    timerRules: TimerRules,
    refs: {
      timeStartRef: string;
      timeFinishRef: string;
      visitTimeRef: string;
    }
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  };
}
