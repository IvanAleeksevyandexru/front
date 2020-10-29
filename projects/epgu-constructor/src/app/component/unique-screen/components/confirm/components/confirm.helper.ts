import { TimerInterface } from '../models/timer.interface';

export function createTimer(start: number, finish: number): TimerInterface {
  const now = Date.now();

  const isCorrectTime = finish - now > 0;

  const time = isCorrectTime ? finish - now : 0;

  const completion = finish - now - (start - now);
  const progress = isCorrectTime ? completion - (now - start) : 0;

  const size = 93;
  const strokeWidth = 3;
  const radius = size / 2 - strokeWidth / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const offset = -((completion - progress) / completion) * circumference;

  return {
    progress,
    completion,
    size,
    strokeWidth,
    radius,
    center,
    circumference,
    offset,
    time,
    start,
    finish,
  };
}
