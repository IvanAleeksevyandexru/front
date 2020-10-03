import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '../../../config/config.service';

@Pipe({
  name: 'imgPrefixer'
})
export class ImgPrefixerPipe implements PipeTransform {

  constructor(private config: ConfigService) { }

  transform(value: string = ''): string {
    return typeof value === 'string'
      ? value.replace('src=\'', `src='${this.config.staticDomainAssetsPath}`)
      : value;
  }

}
