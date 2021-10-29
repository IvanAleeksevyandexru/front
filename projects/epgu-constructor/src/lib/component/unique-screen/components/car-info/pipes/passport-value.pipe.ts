import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passportValue'
})
export class PassportValuePipe implements PipeTransform {

  transform(value: string): string {
    return value.slice(0, 4) + ' ' + value.slice(4);
  }

}
