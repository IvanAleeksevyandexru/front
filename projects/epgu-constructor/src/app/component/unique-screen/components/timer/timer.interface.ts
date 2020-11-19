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
 * Интерфейс
 */
export interface TimerValueInterface {
  time: string;
  timer?: {
    start: string;
    finish: string;
    warningColorFromTime: number;
  };
}

interface TimerAttrValue{
  label?: string,
  type: string,
  value: string
}

/**
 * Секция сведения о заголовка исходя из вмерени
 */
export interface TimerLabelSection{
  label: string,
  fromTime: number
}

/**
 * Правила для таймера
 */
interface TimerRules{
  warningColorFromTime: number,
  labels: TimerLabelSection[]
}

/**
 * Входящие данные для компонента таймер
 */
export interface TimerComponentBase extends ComponentBase{
  attrs: {
    place?: TimerAttrValue,
    address?: TimerAttrValue,
    ceremonyType?: TimerAttrValue,
    time: TimerAttrValue,
    timerRules: TimerRules,
    actions: ComponentDtoAction[],
    timer: {
      start: TimerAttrValue,
      finish: TimerAttrValue
    },
    [key: string]: any
  };
}
