import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskHandle'
})
export class MaskHandlePipe implements PipeTransform {

  public transform(input: Array<string>): Array<string | RegExp> {
    return input.map((char) => {
      return char[0] === '/' ? new RegExp(char.slice(1, -1)) : char;
    });
  }

}
