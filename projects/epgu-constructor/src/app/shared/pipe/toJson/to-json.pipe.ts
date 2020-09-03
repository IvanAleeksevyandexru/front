import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toJson'
})
export class ToJsonPipe implements PipeTransform {

  transform(value: string = '{}', property: string): unknown {
    const toJSON = JSON.parse(value);
    return property ? toJSON[property] : toJSON;
  }

}
