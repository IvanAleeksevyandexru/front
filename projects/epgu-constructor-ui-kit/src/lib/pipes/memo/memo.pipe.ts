import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memo',
})
export class MemoPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(value: any, handler: (value: any, ...args: any) => any, context?: any, ...args): any {
    if (context) {
      return handler.apply(context, [value, ...args]);
    }
    return handler(value, ...args);
  }
}
