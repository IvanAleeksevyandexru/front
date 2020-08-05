import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toJson'
})
export class ToJsonPipe implements PipeTransform {

  public transform(value: string): unknown {
    return value ? JSON.parse(value) : {};
  }

}
