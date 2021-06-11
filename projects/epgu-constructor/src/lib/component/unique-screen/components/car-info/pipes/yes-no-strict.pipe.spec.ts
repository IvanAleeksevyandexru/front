import { YesNoStrictPipe } from './yes-no-strict.pipe';

describe('YesNoStrictPipe', () => {
  const pipe = new YesNoStrictPipe();

  it('should transform true into yes', () => {
    expect(pipe.transform(true)).toBe('Да');
  });

  it('should transform false into no', () => {
    expect(pipe.transform(false)).toBe('Нет');
  });

  it('should transform a not boolean value into a preset default value', () => {
    expect(pipe.transform(null, 'none')).toBe('none');
  });
});
