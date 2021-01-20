import { MaskHandlePipe } from './mask-handle.pipe';
import { MASKS } from './mask.constant';

describe('MaskHandlePipe', () => {
  let pipe: MaskHandlePipe;

  beforeEach(() => {
    pipe = new MaskHandlePipe();
  });

  it('test transform', () => {
    const result = pipe.transform(['/123/', 'string']);
    expect(result[0]).toBeInstanceOf(RegExp);
    expect(result[1]).toBe('string');
  });

  it('test KadastrNumberInput transform', () => {
    const result = pipe.transform('KadastrNumberInput');
    expect(result).toBe(MASKS.KadastrNumberInput);
  });
});
