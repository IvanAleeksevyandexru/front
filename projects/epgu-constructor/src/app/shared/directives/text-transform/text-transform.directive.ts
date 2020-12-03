import { Directive, HostListener, Input } from '@angular/core';
import { TextTransform } from '../../types/textTransform';

@Directive({
  selector: '[epgu-constructor-text-transform]'
})
export class TextTransformDirective {
  private transforms = {
    [TextTransform.ALL]: this.firstLetterOfEachWordToUpperCase,
    [TextTransform.FIRST]: this.firstLetterToUpperCase,
    [TextTransform.UPPERCASE]: this.allToUpperCase,
  };
  private prevValue: string;
  private prevSelection: [number, number];
  @Input() textTransformType: TextTransform;

  @HostListener('input', ['$event.target'])
  onInput(target: HTMLInputElement) {
    if (!this.transforms[this.textTransformType]) {
      return;
    }
    // Проверяет, изменилось ли значение, возвращает курсор
    if (this.prevValue === target.value) {
      target.setSelectionRange(...this.prevSelection);
      return;
    }
    const selection: [number, number] = [target.selectionStart, target.selectionEnd];
    target.value = this.transforms[this.textTransformType].call(this, target.value);
    target.setSelectionRange(...selection);


    // Сохраняет предыдущее значение и позицию курсора
    this.prevValue = target.value;
    this.prevSelection = selection;
  }

  /**
   * Трансформирует первые буквы во всех словах, уичитывает разделитили пробел и тире/деффис
   * @param value - строка на трансформацию
   */
  firstLetterOfEachWordToUpperCase(value: string): string {
    let transformedValue = this.splitAndTransformString(value, ' ');
    transformedValue = this.splitAndTransformString(transformedValue, '‐');
    transformedValue = this.splitAndTransformString(transformedValue, '-');
    return transformedValue;
  }

  /**
   * Разделяет, трансформирует и соединяет строки с учетом разделителя
   * @param value - строка на трансформацию
   * @param separator - разделитель
   */
  splitAndTransformString(value: string, separator: string): string {
    return value.split(separator).map(this.firstLetterToUpperCase).join(separator);
  }

  /**
   * Трансформирует первую букву в строке
   * @param value - строка на трансформацию
   */
  firstLetterToUpperCase(value: string = ''): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  /**
   * Трансформирует все буквы в строке
   * @param value - строка на трансформацию
   */
  allToUpperCase(value: string = ''): string {
    return value.toUpperCase();
  }
}
