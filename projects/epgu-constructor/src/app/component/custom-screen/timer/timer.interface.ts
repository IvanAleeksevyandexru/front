import { ComponentBase } from '../../../screen/screen.types';
import {
  ComponentActionDto,
  TimerRulesDto
} from '../../../form-player/services/form-player-api/form-player-api.types';

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
export interface TimerLabelSection {
  label: string;
  fromTime: number;
}

/**
 * Интерфейс для кнопки таймера с последующим переходом
 */
export interface TimerComponentDtoAction extends ComponentActionDto {
  fromTime?: number;
  toTime?: number;
}

/**
 * Входящие данные для компонента таймер
 */
export interface TimerComponentBase extends ComponentBase {
  attrs: {
    startTime: string,
    currentTime?: string,
    expirationTime: string,
    timerRules: TimerRulesDto,
    refs: {
      timeStartRef: string;
      timeFinishRef: string;
      visitTimeRef: string;
    }
  };
}
