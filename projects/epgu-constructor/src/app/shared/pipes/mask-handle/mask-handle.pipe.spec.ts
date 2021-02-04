import { MaskHandlePipe } from './mask-handle.pipe';
import { MASKS } from './mask.constant';
import { NumberMaskOptionsInterface } from './interface/number-mask-options.interface';

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

  it('test NumberMaskInput transform', () => {
    const priceMaskSpy = jest.spyOn(MASKS, 'NumberMaskInput');

    pipe.transform('NumberMaskInput');

    expect(priceMaskSpy).toBeCalled();
  });

  describe('test NumberMaskInput', () => {
    const setup = (
      maskOptions?: Partial<NumberMaskOptionsInterface>,
    ): { numberMaskTransform: (string) => Array<string | RegExp> } => ({
      numberMaskTransform: (pipe.transform('NumberMaskInput', maskOptions) as unknown) as (
        string,
      ) => Array<string | RegExp>,
    });

    it('provide correct mask for simple number', () => {
      const { numberMaskTransform } = setup();
      expect(numberMaskTransform('123')).toEqual([/\d/, ' ', /\d/, /\d/, /\d/]);
    });

    it('provide correct mask for big number', () => {
      const { numberMaskTransform } = setup();
      const triple = [/\d/, /\d/, /\d/];

      expect(numberMaskTransform('12345678900')).toEqual([
        ...triple,
        ' ',
        ...triple,
        ' ',
        ...triple,
        ' ',
        ...triple,
      ]);
    });

    it('provide correct mask for number with decimals', () => {
      const { numberMaskTransform } = setup();

      expect(numberMaskTransform('123,99')).toEqual([/\d/, /\d/, /\d/, ',', /\d/, /\d/]);
    });

    it('allow to set decimalSymbol', () => {
      const { numberMaskTransform } = setup({ decimalSymbol: '.' });

      expect(numberMaskTransform('123.99')).toEqual([/\d/, /\d/, /\d/, '.', /\d/, /\d/]);
    });

    it('show mask for decimals if user add decimalSeparator', () => {
      const { numberMaskTransform } = setup({ decimalSymbol: '.' });

      expect(numberMaskTransform('123')).toEqual([/\d/, ' ', /\d/, /\d/, /\d/]);
      expect(numberMaskTransform('123.')).toEqual([/\d/, /\d/, /\d/, '.', /\d/, /\d/]);
      expect(numberMaskTransform('123.9')).toEqual([/\d/, /\d/, /\d/, '.', /\d/, /\d/]);
    });

    it('clean decimals if user start to remove chars', () => {
      const { numberMaskTransform } = setup({ decimalSymbol: '.' });

      expect(numberMaskTransform('123.99')).toEqual([/\d/, /\d/, /\d/, '.', /\d/, /\d/]);
      expect(numberMaskTransform('123.9')).toEqual([/\d/, /\d/, /\d/, '.', /\d/, /\d/]);
      expect(numberMaskTransform('123.')).toEqual([/\d/, ' ', /\d/, /\d/, /\d/]);
    });

    it('show mask for decimals if user add/remove then add again decimalSeparator', () => {
      const { numberMaskTransform } = setup({ decimalSymbol: '.' });

      expect(numberMaskTransform('123')).toEqual([/\d/, ' ', /\d/, /\d/, /\d/]);
      expect(numberMaskTransform('123.')).toEqual([/\d/, /\d/, /\d/, '.', /\d/, /\d/]);
      expect(numberMaskTransform('123.9')).toEqual([/\d/, /\d/, /\d/, '.', /\d/, /\d/]);
      expect(numberMaskTransform('123.99')).toEqual([/\d/, /\d/, /\d/, '.', /\d/, /\d/]);
      expect(numberMaskTransform('123.9')).toEqual([/\d/, /\d/, /\d/, '.', /\d/, /\d/]);
      expect(numberMaskTransform('123.')).toEqual([/\d/, ' ', /\d/, /\d/, /\d/]);
      expect(numberMaskTransform('123.')).toEqual([/\d/, /\d/, /\d/, '.', /\d/, /\d/]);
    });

    it('provide correct mask when user try to pass invalid chars like letters', () => {
      const { numberMaskTransform } = setup();

      expect(numberMaskTransform('123afds')).toEqual([/\d/, ' ', /\d/, /\d/, /\d/]);
    });
  });
});
