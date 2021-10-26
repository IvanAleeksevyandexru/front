import { NumberMaskOptions } from './mask-options';

export const numberMaskDefaultOptions: Partial<NumberMaskOptions> = {
  prefix: '',
  requireDecimal: true,
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ' ',
  decimalSymbol: '.',
  decimalLimit: 2,
  allowDecimalRounding: false,
};

export enum MASKS {
  KadastrNumberInput = 'KadastrNumberInput',
  NumberMaskInput = 'NumberMaskInput',
  PhoneWithCodeMaskInput = 'PhoneWithCodeMaskInput',
}

export const DecimalSymbolReplacer = {
  ',': '.',
  '.': ',',
};

export const MASKS_HANDLERS = {
  [MASKS.KadastrNumberInput]: (value: string): (string | RegExp)[] => {
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
    maskOptions: Partial<NumberMaskOptions>,
  ): ((value: string) => (string | RegExp)[]) => {
    const options = { ...numberMaskDefaultOptions, ...maskOptions };

    const cleanupPattern = new RegExp(
      `[^0-9${options.requireDecimal || options.allowDecimal ? options.decimalSymbol : ''}]`,
      'g',
    );

    let hadDecimals = false;

    return (value: string): (string | RegExp)[] => {
      const decimalSymbol = options.decimalSymbol;
      const cleanValue = DecimalSymbolReplacer[decimalSymbol] ?
        value.replace(DecimalSymbolReplacer[decimalSymbol], decimalSymbol).replace(cleanupPattern, '') :
        value.replace(cleanupPattern, '');

      const parts: string[] = cleanValue.split(options.decimalSymbol);
      const hasDecimals: boolean = parts.length > 1;
      const [integerPart, decimalPart] = parts;
      const emptyDecimals: boolean = !hasDecimals || decimalPart === '';
      const maskForDecimalsShown = hasDecimals && (!hadDecimals || !emptyDecimals);
      const mask: (string | RegExp)[] = [];

      if (maskForDecimalsShown) {
        for (
          let i = 0,
            length = Math.min(options.allowDecimalRounding ? options.decimalLimit + 1 : options.decimalLimit, decimalPart.length + 1);
          i < length;
          i += 1
        ) {
          mask.unshift(/\d/);
        }
        mask.unshift(options.decimalSymbol);
      }

      hadDecimals = maskForDecimalsShown;

      for (let i = 0; i < integerPart.length; i += 1) {
        mask.unshift(/\d/);
        const isLastSymbol = i === integerPart.length - 1;
        const isSeparatorTime = i % 3 === 2;

        if (options.includeThousandsSeparator && isSeparatorTime && !isLastSymbol) {
          mask.unshift(options.thousandsSeparatorSymbol);
        }
      }

      return mask;
    };
  },
  [MASKS.PhoneWithCodeMaskInput]: (value: string): (string | RegExp)[] => {
    const mask = [
      '+',
      '7',
      ' ',
      '(',
      /\d/,
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
    ];
    const lastChar = value.slice(-1);

    /* NOTICE: тут по необходимости дополняется маска, если вбивается номер телефона с дополнительным кодом (через *)  */
    if (value.length === 19 && lastChar === '*') {
      mask.push('*', /\d/);
    } else if (value.length === 21) {
      mask.push('*', /\d/, /\d/);
    } else if (value.length === 22) {
      mask.push('*', /\d/, /\d/, /\d/);
    } else if (value.length === 23) {
      mask.push('*', /\d/, /\d/, /\d/, /\d/);
    } else if (value.length === 24) {
      mask.push('*', /\d/, /\d/, /\d/, /\d/, /\d/);
    } else if (value.length >= 25) {
      mask.push('*', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/);
    }
    return mask;
  },
};
