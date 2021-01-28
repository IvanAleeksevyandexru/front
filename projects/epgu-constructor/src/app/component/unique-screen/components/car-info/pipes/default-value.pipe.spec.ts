import { DefaultValuePipe } from './default-value.pipe';

describe('DefaultValuePipe', () => {
  const pipe = new DefaultValuePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a falsy value into a default value', () => {
    expect(pipe.transform(null)).toBe('—');
  });

  it('should return a value itself', () => {
    expect(pipe.transform('value')).toBe('value');
  });

  it('should transform a falsy value into a preset default value', () => {
    expect(pipe.transform(null, 'none')).toBe('none');
  });

});
