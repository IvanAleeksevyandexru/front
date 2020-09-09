import { TimerPipe } from './timer.pipe';

describe('TimerPipe', () => {
  const pipe: TimerPipe = new TimerPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms time', () => {
    expect(pipe.transform(31985443)).toBe('08:53:05');
  });
});
