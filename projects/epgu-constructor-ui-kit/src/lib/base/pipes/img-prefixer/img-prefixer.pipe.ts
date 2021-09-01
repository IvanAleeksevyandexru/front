import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '../../../core/services/config/config.service';

interface Error {
  message: string;
  stack: string;
}
@Pipe({
  name: 'imgPrefixer',
})
export class ImgPrefixerPipe implements PipeTransform {
  constructor(private config: ConfigService) {}

  transform(value: string | Error): string {
    const replacer = (match, quoteSymbol, staticDomainPrefix?): string => {
      if (staticDomainPrefix) {
        return `src=${quoteSymbol}${this.config.staticDomainAssetsPath || ''}`;
      }

      return match;
    };
    const regExp = /src=(\'|\")(\{staticDomainAssetsPath\})?/g;

    return (((value as Error)?.message || value || '') as String).replace(regExp, replacer);
  }
}
