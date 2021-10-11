import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'smev3ErrorMessage',
})
export class Smev3ErrorMessagePipe implements PipeTransform {
  transform(value: string): string {
    return value.substring(value.indexOf(':') + 1);
  }
}
