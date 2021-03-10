import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addZeroPenny',
})
export class AddZeroPennyPipe implements PipeTransform {
  transform(money: string): string {
    return /,\d{1,2}$/.exec(money) ? money : `${money},00`;
  }
}
