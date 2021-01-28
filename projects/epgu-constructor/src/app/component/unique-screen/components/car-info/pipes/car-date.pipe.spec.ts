import { CarDatePipe } from './car-date.pipe';

describe('CarDatePipe', () => {
  const pipe = new CarDatePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform dates into a period', () => {
    expect(pipe.transform('10.10.2010', '10.10.2012')).toBe('10.10.2010 - 10.10.2012');
  });

  it('shouldn\'t transform dates into a period if one of the dates is missing', () => {
    expect(pipe.transform('10.10.2010', null)).toBe(null);
  });
});
