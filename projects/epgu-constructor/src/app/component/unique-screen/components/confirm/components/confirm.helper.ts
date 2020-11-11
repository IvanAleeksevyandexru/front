import { TimerInterface } from '../models/timer.interface';

export function createTimer(start: number, finish: number, warningTime: number): TimerInterface {
  const now = Date.now();

  const isCorrectTime = finish - now > 0;
  const time = isCorrectTime ? finish - now : 0;
  const isWarning = time <= warningTime;
  const isFinish = time === 0;

  return {
    isWarning,
    isFinish,
    time,
    start,
    finish
  };
}
