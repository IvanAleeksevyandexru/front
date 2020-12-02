import { MaskHandlePipe } from './mask-handle.pipe';

describe('MaskHandlePipe', () => {
  const pipe = new MaskHandlePipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('test transform', () => {
    const result = pipe.transform(['/123/', 'string']);
    expect(result[0]).toBeInstanceOf(RegExp);
    expect(result[1]).toBe('string');
  });
});
