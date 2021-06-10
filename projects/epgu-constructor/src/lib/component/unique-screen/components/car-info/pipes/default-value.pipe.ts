import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultValue'
})
export class DefaultValuePipe implements PipeTransform {

  transform(value: string, defaultValue: string = '—'): string {
    return value ? value : defaultValue;
  }

}
