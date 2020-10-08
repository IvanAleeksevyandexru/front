import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '../../../config/config.service';

@Pipe({
  name: 'imgPrefixer'
})
export class ImgPrefixerPipe implements PipeTransform {

  constructor(private config: ConfigService) { }

  transform(value: string = ''): string {
    const replacer = (match, quoteSymbol) => {
      return `src=${quoteSymbol}${this.config.staticDomainAssetsPath}`;
    };
    const regExp = /src=(\'|\")/g;

    return value.replace(regExp, replacer);
  }

}
