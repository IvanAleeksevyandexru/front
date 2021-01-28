import { YesNoPipe } from './yes-no.pipe';

describe('YesNoPipe', () => {
  const pipe = new YesNoPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform true into yes', () => {
    expect(pipe.transform(true)).toBe('Да');
  });

  it('should transform false into no', () => {
    expect(pipe.transform(false)).toBe('Нет');
  });
});
