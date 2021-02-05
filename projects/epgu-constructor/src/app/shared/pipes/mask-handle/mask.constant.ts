import { NumberMaskOptionsInterface } from './interface/number-mask-options.interface';

export const MASKS = {
  KadastrNumberInput: (value: string): Array<string | RegExp> => {
    const mask = [/\d/, /\d/, ':', /\d/, /\d/, ':'];
    const chunks = value.replace(/_/g, '').split(':');
    let i;

    for (i = 0; (!chunks[2] || i < chunks[2].length) && i < 7; i++) {
      mask.push(/\d/);
    }

    if (!chunks[3] && (!chunks[2] || chunks[2].length < 7)) {
      mask.push(/\d|:/);
    } else {
      mask.push(':');
    }

    for (i = 0; (!chunks[3] || i <= chunks[3].length) && i < 9; i++) {
      mask.push(/\d/);
    }

    return mask;
  },
  NumberMaskInput: (
    maskOptions: Partial<NumberMaskOptionsInterface>,
  ): ((string) => Array<string | RegExp>) => {
    const defaultOptions: Partial<NumberMaskOptionsInterface> = {
      prefix: '',
      requireDecimal: true,
      includeThousandsSeparator: true,
      thousandsSeparatorSymbol: ' ',
      decimalSymbol: ',',
    };
    const options = { ...defaultOptions, ...maskOptions };

    const cleanupPattern = new RegExp(
      `[^0-9${options.requireDecimal || options.allowDecimal ? options.decimalSymbol : ''}]`,
      'g',
    );

    let hadDecimals = false;

    return (value: string): Array<string | RegExp> => {
      const cleanValue = value.replace(cleanupPattern, '');
      const parts: string[] = cleanValue.split(options.decimalSymbol);
      const hasDecimals: boolean = parts.length > 1;
      const emptyDecimals: boolean = !hasDecimals || parts[1] === '';
      const maskForDecimalsShown: boolean = hasDecimals && (!hadDecimals || !emptyDecimals);
      const maskLength = parts[0].length + (maskForDecimalsShown ? 0 : 1);
      const mask: Array<string | RegExp> = maskForDecimalsShown
        ? [options.decimalSymbol, /\d/, /\d/]
        : [];
      hadDecimals = maskForDecimalsShown;

      for (let i = 0; i < maskLength; i += 1) {
        mask.unshift(/\d/);
        if (options.includeThousandsSeparator && i % 3 === 2 && i !== maskLength - 1) {
          mask.unshift(options.thousandsSeparatorSymbol);
        }
      }

      return mask;
    };
  },
};
