import { ToJsonPipe } from './to-json.pipe';

describe('ToJsonPipe', () => {
  const pipe = new ToJsonPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('test transform', () => {
    expect(pipe.transform('{"test":"test"}', 'test')).toBe('test');
  });
});
