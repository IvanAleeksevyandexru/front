import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enginePower'
})
export class EnginePowerPipe implements PipeTransform {

  transform(enginePowerVt: string, enginePowerHorse: string): string {
    return [enginePowerVt, enginePowerHorse].filter((value) => !!value).join('/');
  }

}
