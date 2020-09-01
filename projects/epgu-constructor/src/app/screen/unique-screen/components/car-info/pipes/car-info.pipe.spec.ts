import { CarInfoLegalPipe } from './car-info.pipe';

describe('CarInfoDatePipe', () => {
  const pipe = new CarInfoLegalPipe();

  it('transforms "PLEDGED" to "Находится в залоге"', () => {
    expect(pipe.transform('PLEDGED')).toBe('Находится в залоге');
  });

  it('transforms "WANTED" to "Находится в розыске"', () => {
    expect(pipe.transform('WANTED')).toBe('Находится в розыске');
  });

  it('transforms "RESTRICTIONS" to "Ограничения на регистрацию"', () => {
    expect(pipe.transform('RESTRICTIONS')).toBe('Ограничения на регистрацию');
  });
});
