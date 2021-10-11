import { PriorPrefixPipe } from './prior-prefix.pipe';

describe('PriorPrefixPipe', () => {
  let pipe: PriorPrefixPipe;

  beforeEach(() => {
    pipe = new PriorPrefixPipe();
  });

  it('should remove "PRIOR" before uin value', () => {
    const sourceUin = 'PRIOR0316373302092021005410575';
    const expectedUin = '0316373302092021005410575';
    const receivedUin = pipe.transform(sourceUin);

    expect(receivedUin).toBe(expectedUin);
  });

  it('should not remove anything before uin value', () => {
    const sourceUin = '0316373302092021005410575';
    const expectedUin = '0316373302092021005410575';
    const receivedUin = pipe.transform(sourceUin);

    expect(receivedUin).toBe(expectedUin);
  });
});
