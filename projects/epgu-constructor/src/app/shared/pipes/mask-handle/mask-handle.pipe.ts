import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskHandle'
})
export class MaskHandlePipe implements PipeTransform {

  public transform(input: Array<string>): Array<string | RegExp> {
    return input.map((char) => {
      const isRegExp = char[0] === '/';
      return isRegExp ? this.strToRegExp(char) : char;
    });
  }

  private strToRegExp(str: string): RegExp {
    const index = str.lastIndexOf('/');
    return new RegExp(str.slice(1, index), str.slice(index + 1));
  }
}
