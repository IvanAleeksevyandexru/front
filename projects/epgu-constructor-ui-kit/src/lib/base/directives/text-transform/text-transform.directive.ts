import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { TextTransform } from '@epgu/epgu-constructor-types';
import { TextTransformService } from '../../../core/services/text-transform/text-transform.service';

@Directive({
  selector: '[epgu-cf-ui-constructor-text-transform]',
})
export class TextTransformDirective {
  @Input() textTransformType: TextTransform;

  private transforms = {
    [TextTransform.ALL]: this.firstLetterOfEachWordToUpperCase,
    [TextTransform.FIRST]: this.firstLetterToUpperCase,
    [TextTransform.UPPERCASE]: this.allToUpperCase,
  };

  private prevValue: string;

  private prevSelection: [number, number];

  constructor(private control: NgControl, private textTransform: TextTransformService) {}

  @HostListener('input', ['$event.target'])
  onInput(target: HTMLInputElement): void {
    if (!this.transforms[this.textTransformType]) {
      return;
    }
    // Проверяет, изменилось ли значение, возвращает курсор
    if (this.prevValue === target.value) {
      target.setSelectionRange(...this.prevSelection);
      return;
    }

    /* Вычисляем текущее положение курсора сначала с опрой на маску, т.к. на мобильных устройствах target.selectionStart
    имеет свойство криво вычисляться из-за чего курсор становится в конец строки с маской */
    const currentCursorPosition = target.value?.indexOf('_') || target.selectionStart || 0;
    const selection: [number, number] = [currentCursorPosition, currentCursorPosition];
    const transformedValue = this.transforms[this.textTransformType].call(this, target.value);
    this.control.control.setValue(transformedValue);
    /* Здесь выносим в макротаску опять же по причине особенности работы курсора на мобильных клавиатурах,
    где по-умолчанию может быть включена автокоррекция и саджесты.
    Ref: https://github.com/text-mask/text-mask/issues/300 */
    setTimeout(() => {
      target.setSelectionRange(...selection);
    });

    // Сохраняет предыдущее значение и позицию курсора
    this.prevValue = target.value;
    this.prevSelection = selection;
  }

  public firstLetterOfEachWordToUpperCase(value: string): string {
    return this.textTransform.firstLetterOfEachWordToUpperCase(value);
  }

  public firstLetterToUpperCase(value: string = ''): string {
    return this.textTransform.firstLetterToUpperCase(value);
  }

  public allToUpperCase(value: string = ''): string {
    return this.textTransform.allToUpperCase(value);
  }
}
