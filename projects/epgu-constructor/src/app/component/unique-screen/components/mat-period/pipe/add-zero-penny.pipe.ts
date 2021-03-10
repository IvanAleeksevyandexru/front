import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addZeroPenny',
})
export class AddZeroPennyPipe implements PipeTransform {
  transform(money: string): unknown {
    return /,\d{1,2}$/.exec(money) ? money : `${money},00`;
  }
}
