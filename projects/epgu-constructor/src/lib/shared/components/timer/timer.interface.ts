import { TimerRulesDto } from '@epgu/epgu-constructor-types';
import { ComponentBase } from '../../../screen/screen.types';

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
 * Входящие данные для компонента таймер
 */
export interface TimerComponentBase extends ComponentBase {
  attrs: {
    startTime: string;
    currentTime?: string;
    expirationTime: string;
    timerRules: TimerRulesDto;
    refs: {
      timeStartRef: string;
      timeFinishRef: string;
      visitTimeRef: string;
    };
  };
}
