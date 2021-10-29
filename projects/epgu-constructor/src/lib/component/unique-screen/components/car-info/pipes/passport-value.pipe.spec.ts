import { PassportValuePipe } from './passport-value.pipe';

describe('PassportValuePipe', () => {
  it('create an instance', () => {
    const pipe = new PassportValuePipe();
    expect(pipe).toBeTruthy();
  });
});
