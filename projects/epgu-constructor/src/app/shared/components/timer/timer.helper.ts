import { TimerInterface } from './timer.interface';

/**
 * Создаёт данные для таймера
 * @param current - текущее время
 * @param start - время начала
 * @param finish - время окончания
 * @param warningTime - промежуток времени когда в секундах для подсветки красным
 */
export function createTimer(current: number, start: number, finish: number, warningTime: number | undefined): TimerInterface {
  const isCorrectTime = (finish - current) > 0;
  const time = isCorrectTime ? finish - current : 0;

  return {
    isWarning: isWarning(time, warningTime),
    isFinish: isFinish(time),
    time,
    start,
    finish
  };
}

/**
 * Возвращает true, если нужно подсветить таймер закончился
 * @param time - время для сравнения
 */
export function isFinish(time: number):boolean {
  return  time === 0;
}

/**
 * Возвращает true, если нужно подсветить таймер красным
 * @param time - время для сравнения
 * @param warningTime - промежуток времени когда в секундах для подсветки красным
 */
export function isWarning(time: number, warningTime: number | undefined):boolean {
  if (!warningTime) {
    return false;
  }
  const checkTime = warningTime * 1000;
  return warningTime > 0 ? time <= checkTime : false;
}
