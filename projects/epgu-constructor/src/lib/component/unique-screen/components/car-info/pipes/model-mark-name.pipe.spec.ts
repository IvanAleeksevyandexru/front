import { ModelMarkNamePipe } from './model-mark-name.pipe';

describe('ModelMarkNamePipe', () => {
  const pipe = new ModelMarkNamePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return modelMarkName', () => {
    expect(pipe.transform('Kia Rio', null, null)).toBe('Kia Rio');
  });

  it('should transform mark and model into modelMarkName', () => {
    expect(pipe.transform(null, 'Kia', 'Rio')).toBe('Kia Rio');
  });

  it('should return an empty string if there aren\'t values at all', () => {
    expect(pipe.transform(null, null, null)).toBe('');
  });
});
