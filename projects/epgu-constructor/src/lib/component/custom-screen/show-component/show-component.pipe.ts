import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showComponent',
})
export class ShowComponentPipe implements PipeTransform {
  transform(isShown: boolean, hidden: boolean): boolean {
    return isShown && !hidden;
  }
}
