import { Directive, HostListener, Input } from '@angular/core';
import { TextTransform } from '../../types/textTransform';

@Directive({
  selector: '[epgu-constructor-text-transform]'
})
export class TextTransformDirective {
  @Input() textTransformType: TextTransform;

  @HostListener('keyup', ['$event.target'])
  onKeyUp(target) {
    if(this.textTransformType === TextTransform.ALL) {
      target.value = this.firstLetterOfEachWordToUpperCase(target.value);
    } else if (this.textTransformType === TextTransform.FIRST) {
      target.value = this.firstLetterToUpperCase(target.value);
    }
  }

  @HostListener('change', ['$event.target'])
  onChange(target) {
    if (this.textTransformType === TextTransform.UPPERCASE) {
      target.value = this.allToUpperCase(target.value);
    }
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
