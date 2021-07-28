import { Pipe, PipeTransform } from '@angular/core';
import { MASKS, MASKS_HANDLERS } from './mask.constant';
import { NumberMaskOptions } from './mask-options';

@Pipe({
  name: 'maskHandle',
})
export class MaskHandlePipe implements PipeTransform {
  public transform(input: string | string[], maskOptions?: object): (string | RegExp)[] {
    if (typeof input === 'string') {
      switch (input) {
        case MASKS.KadastrNumberInput:
          return (MASKS_HANDLERS[MASKS.KadastrNumberInput] as unknown) as (string | RegExp)[];
        case MASKS.NumberMaskInput:
          return (MASKS_HANDLERS[MASKS.NumberMaskInput](
            maskOptions as Partial<NumberMaskOptions>,
          ) as unknown) as (string | RegExp)[];
        default:
          return null;
      }
    }

    if (Array.isArray(input)) {
      return input.map((char) => {
        const isRegExp = char[0] === '/' && char.length > 1;
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
