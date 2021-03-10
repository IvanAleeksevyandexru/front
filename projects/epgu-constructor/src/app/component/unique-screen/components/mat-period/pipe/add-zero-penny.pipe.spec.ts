import { AddZeroPennyPipe } from './add-zero-penny.pipe';

describe('AddZeroPennyPipe', () => {
  const pipe = new AddZeroPennyPipe();

  it('should be return 100,00', () => {
    const value = pipe.transform('100');
    expect(value).toBe('100,00');
  });

  it('should be return 100,26', () => {
    const value = pipe.transform('100,26');
    expect(value).toBe('100,26');
  });

  it('should be return 100,10', () => {
    const value = pipe.transform('100,01');
    expect(value).toBe('100,01');
  });

  it('should be return 100,10', () => {
    const value = pipe.transform('100,10');
    expect(value).toBe('100,10');
  });
});
