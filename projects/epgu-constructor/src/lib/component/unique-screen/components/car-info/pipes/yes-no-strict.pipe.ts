import { Pipe, PipeTransform } from '@angular/core';
import { isBoolean } from 'lodash';

@Pipe({
  name: 'yesNoStrict',
})
export class YesNoStrictPipe implements PipeTransform {
  transform(value?: boolean, defaultValue: string = '—'): string {
    if (isBoolean(value)) {
      return value ? 'Да' : 'Нет';
    }

    return defaultValue;
  }
}
