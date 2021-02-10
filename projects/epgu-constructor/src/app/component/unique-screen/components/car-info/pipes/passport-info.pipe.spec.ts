import { PassportInfoPipe } from './passport-info.pipe';

describe('PassportInfoPipe', () => {
  it('create an instance', () => {
    const pipe = new PassportInfoPipe();
    expect(pipe).toBeTruthy();
  });
});
