import { Pipe, PipeTransform } from '@angular/core';
import { MASKS } from './mask.constant';
import { NumberMaskOptionsInterface } from './interface/number-mask-options.interface';

@Pipe({
  name: 'maskHandle',
})
export class MaskHandlePipe implements PipeTransform {
  public transform(input: string | string[], maskOptions?: object): Array<string | RegExp> {
    if (typeof input === 'string') {
      switch (input) {
        case 'KadastrNumberInput':
          return (MASKS.KadastrNumberInput as unknown) as Array<string | RegExp>;
        case 'NumberMaskInput':
          return (MASKS.NumberMaskInput(
            maskOptions as Partial<NumberMaskOptionsInterface>,
          ) as unknown) as Array<string | RegExp>;
        default:
          return null;
      }
    }

    if (Array.isArray(input)) {
      return input.map((char) => {
        const isRegExp = char[0] === '/';
        return isRegExp ? this.strToRegExp(char) : char;
      });
    }

    return null;
  }

  private strToRegExp(str: string): RegExp {
    const index = str.lastIndexOf('/');
    return new RegExp(str.slice(1, index), str.slice(index + 1));
  }
}
