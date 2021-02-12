import { NumberMaskOptionsInterface } from './interface/number-mask-options.interface';

export const numberMaskDefaultOptions: Partial<NumberMaskOptionsInterface> = {
  prefix: '',
  requireDecimal: true,
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ' ',
  decimalSymbol: '.',
  decimalLimit: 2,
};

export enum MASKS {
  KadastrNumberInput = 'KadastrNumberInput',
  NumberMaskInput = 'NumberMaskInput',
}

export const MASKS_HANDLERS = {
  [MASKS.KadastrNumberInput]: (value: string): Array<string | RegExp> => {
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
  [MASKS.NumberMaskInput]: (
    maskOptions: Partial<NumberMaskOptionsInterface>,
  ): ((string) => Array<string | RegExp>) => {
    const options = { ...numberMaskDefaultOptions, ...maskOptions };

    const cleanupPattern = new RegExp(
      `[^0-9${options.requireDecimal || options.allowDecimal ? options.decimalSymbol : ''}]`,
      'g',
    );

    let hadDecimals = false;

    return (value: string): Array<string | RegExp> => {
      const cleanValue = value.replace(cleanupPattern, '');
      const parts: string[] = cleanValue.split(options.decimalSymbol);
      const hasDecimals: boolean = parts.length > 1;
      const [integerPart, decimalPart] = parts;
      const emptyDecimals: boolean = !hasDecimals || decimalPart === '';
      const maskForDecimalsShown = hasDecimals && (!hadDecimals || !emptyDecimals);
      const maskLength = integerPart.length + (maskForDecimalsShown ? 0 : 1);
      const mask: Array<string | RegExp> = [];

      if (maskForDecimalsShown) {
        for (let i = 0; i < Math.min(options.decimalLimit, decimalPart.length + 1); i += 1) {
          mask.unshift(/\d/);
        }
        mask.unshift(options.decimalSymbol);
      }

      hadDecimals = maskForDecimalsShown;

      for (let i = 0; i < maskLength; i += 1) {
        mask.unshift(/\d/);
        const isLastSymbol = i === maskLength - 1;

        // -1 означает, что справа 4 символа (3 числа и _ от маски), потом идёт по три, между ними разделитель тысяч
        const isSeparatorTime = (i - 1) % 3 === 2;

        if (options.includeThousandsSeparator && isSeparatorTime && !isLastSymbol) {
          mask.unshift(options.thousandsSeparatorSymbol);
        }
      }

      return mask;
    };
  },
};
