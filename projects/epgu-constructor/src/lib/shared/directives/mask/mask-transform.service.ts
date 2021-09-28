import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { numberMaskDefaultOptions, NumberMaskOptions } from '@epgu/epgu-constructor-ui-kit';

@Injectable()
export class MaskTransformService {
  private localeThousandSeparator = this.decimalPipe.transform(1234, '0.0-0').replace(/\d/g, '');
  private localeDecimalSeparator = this.decimalPipe.transform(1.23, '0.2-2').replace(/\d/g, '');
  constructor(private decimalPipe: DecimalPipe) {}

  public transformNumberMaskInput(value: string, maskOptions: Partial<NumberMaskOptions>): string {
    const options = { ...numberMaskDefaultOptions, ...maskOptions };

    let result = value.replace(options.decimalSymbol, '.').replace(/[^\d.]/g, '') || '0';

    if (!Number.isNaN(+result)) {
      result = this.decimalPipe
        .transform(result.substring(0, 10), `0.${options.decimalLimit}-${options.decimalLimit}`)
        .replace(
          new RegExp(this.localeThousandSeparator, 'g'),
          options.includeThousandsSeparator ? options.thousandsSeparatorSymbol : '',
        )
        .replace(this.localeDecimalSeparator, options.decimalSymbol);
    }
    return result;
  }
}
