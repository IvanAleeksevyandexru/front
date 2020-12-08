import { ToJsonPipe } from './to-json.pipe';

describe('ToJsonPipe', () => {
  let pipe: ToJsonPipe;

  beforeEach(() => {
    pipe = new ToJsonPipe();
  });

  it('test transform', () => {
    expect(pipe.transform('{"test":"test"}', 'test')).toBe('test');
  });
});
