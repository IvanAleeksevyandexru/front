import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memo',
})
export class MemoPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(value: any, handler: (value: any) => any, context?: any): any {
    if (context) {
      return handler.call(context, value);
    }
    return handler(value);
  }
}
