import { Pipe, PipeTransform } from '@angular/core';
import { isBoolean } from '@epgu/epgu-constructor-ui-kit';

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
