import { PassportInfoPipe } from './passport-info.pipe';

describe('PassportInfoPipe', () => {
  const pipe = new PassportInfoPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return passport info', () => {
    expect(pipe.transform('4565', '545454', '01.01.2000')).toBe('4565 545454, дата выдачи 01.01.2000');
  });


  it('should return null if any value is missing', () => {
    expect(pipe.transform('4565', null, '01.01.2000')).toBe(null);
  });

});
