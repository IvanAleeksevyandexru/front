import { Injectable } from '@angular/core';
import { TextTransform } from '@epgu/epgu-constructor-types';

@Injectable()
export class TextTransformService {
  // NOTE: Символы '‐' и '-' - разные ('hyphen' и 'dash'), отображаются идентично из-за моноширинного шрифта
  private readonly separators: string[] = [' ', '‐', '-'];

  private transforms = {
    [TextTransform.ALL]: this.firstLetterOfEachWordToUpperCase.bind(this),
    [TextTransform.FIRST]: this.firstLetterToUpperCase.bind(this),
    [TextTransform.UPPERCASE]: this.allToUpperCase.bind(this),
  };

  public transform(value: string, textTransformType: TextTransform): string {
    return this.transforms[textTransformType](value);
  }

  /**
   * Трансформирует первые буквы во всех словах, учитывает разделители из массива 'separators'
   * @param value - строка на трансформацию
   */
  public firstLetterOfEachWordToUpperCase(value: string): string {
    return this.separators.reduce((accumulator, currentValue) => {
      return this.splitAndTransformString(accumulator, currentValue);
    }, value);
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
