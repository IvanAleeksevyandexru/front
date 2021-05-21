import { Injectable } from '@angular/core';
import { TextTransform } from 'epgu-constructor-types';

@Injectable()
export class TextTransformService {
  private transforms = {
    [TextTransform.ALL]: this.firstLetterOfEachWordToUpperCase.bind(this),
    [TextTransform.FIRST]: this.firstLetterToUpperCase.bind(this),
    [TextTransform.UPPERCASE]: this.allToUpperCase.bind(this),
  };

  public transform(value: string, textTransformType: TextTransform): string {
    return this.transforms[textTransformType](value);
  }

  /**
   * Трансформирует первые буквы во всех словах, уичитывает разделитили пробел и тире/деффис
   * @param value - строка на трансформацию
   */
  public firstLetterOfEachWordToUpperCase(value: string): string {
    let transformedValue = this.splitAndTransformString(value, ' ');
    transformedValue = this.splitAndTransformString(transformedValue, '‐');
    return this.splitAndTransformString(transformedValue, '-');
  }

  /**
   * Трансформирует первую букву в строке
   * @param value - строка на трансформацию
   */
  public firstLetterToUpperCase(value: string = ''): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  /**
   * Трансформирует все буквы в строке
   * @param value - строка на трансформацию
   */
  public allToUpperCase(value: string = ''): string {
    return value.toUpperCase();
  }

  /**
   * Разделяет, трансформирует и соединяет строки с учетом разделителя
   * @param value - строка на трансформацию
   * @param separator - разделитель
   */
  private splitAndTransformString(value: string, separator: string): string {
    return value.split(separator).map(this.firstLetterToUpperCase).join(separator);
  }
}
