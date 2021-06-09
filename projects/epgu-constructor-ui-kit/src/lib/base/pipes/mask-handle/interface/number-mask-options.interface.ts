// @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/text-mask-addons/index.d.ts
export interface NumberMaskOptionsInterface {
  prefix: string;
  suffix: string;
  includeThousandsSeparator: boolean;
  thousandsSeparatorSymbol: string;
  allowDecimal: boolean;
  decimalSymbol: string;
  decimalLimit: number;
  requireDecimal: boolean;
  allowNegative: boolean;
  allowLeadingZeroes: boolean;
  integerLimit: number | null;
}
