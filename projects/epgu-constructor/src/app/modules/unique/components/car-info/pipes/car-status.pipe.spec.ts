import { CarInfoStatusPipe } from './car-status.pipe';

describe('CarInfoStatusPipe', () => {
  const pipe = new CarInfoStatusPipe();

  it('transforms "REGISTERED" to "Состоит на государственном учете"', () => {
    expect(pipe.transform('REGISTERED')).toBe('Состоит на государственном учете');
  });

  it('transforms "NOT_REGISTERED" to "Не состоит на государственном учете"', () => {
    expect(pipe.transform('NOT_REGISTERED')).toBe('Не состоит на государственном учете');
  });

  it('transforms "REMOVED" to "Снято с государственного учета"', () => {
    expect(pipe.transform('REMOVED')).toBe('Снято с государственного учета');
  });

  it('transforms "SUSPENDED" to "Учет приостановлен"', () => {
    expect(pipe.transform('SUSPENDED')).toBe('Учет приостановлен');
  });
});
