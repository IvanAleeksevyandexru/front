import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priorPrefix',
})
export class PriorPrefixPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace('PRIOR', '');
  }
}
