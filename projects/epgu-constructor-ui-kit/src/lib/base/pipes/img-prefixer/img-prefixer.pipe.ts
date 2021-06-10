import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '../../../core/services/config/config.service';

@Pipe({
  name: 'imgPrefixer',
})
export class ImgPrefixerPipe implements PipeTransform {
  constructor(private config: ConfigService) {}

  transform(value: string): string {
    const replacer = (match, quoteSymbol, staticDomainPrefix?): string => {
      if (staticDomainPrefix) {
        return `src=${quoteSymbol}${this.config.staticDomainAssetsPath || ''}`;
      }

      return match;
    };
    const regExp = /src=(\'|\")(\{staticDomainAssetsPath\})?/g;

    return (value || '').replace(regExp, replacer);
  }
}
