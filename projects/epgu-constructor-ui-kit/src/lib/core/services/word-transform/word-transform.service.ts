import { Injectable } from '@angular/core';
import { ObjectHelperService } from '../object-helper/object-helper.service';

interface TranslitAlphabet {
  [propName: string]: string;
}

/*eslint quote-props: ["error", "always"]*/
const LETTERS = {
  'а': 'a',
  'б': 'b',
  'в': 'v',
  'г': 'g',
  'д': 'd',
  'е': 'e',
  'ё': 'e',
  'ж': 'zh',
  'з': 'z',
  'и': 'i',
  'й': 'i',
  'к': 'k',
  'л': 'l',
  'м': 'm',
  'н': 'n',
  'о': 'o',
  'п': 'p',
  'р': 'r',
  'с': 's',
  'т': 't',
  'у': 'u',
  'ф': 'f',
  'х': 'kh',
  'ч': 'ch',
  'ц': 'ts',
  'щ': 'shch',
  'ш': 'sh',
  'ъ': 'ie',
  'ы': 'y',
  'э': 'e',
  'ю': 'iu',
  'я': 'ia',
  'ь': ''
} as TranslitAlphabet;

@Injectable()
export class WordTransformService {
  constructor (private objectHelperService: ObjectHelperService) {}

  /**
   * Converts cyrillic to latin
   * @param word
   */
  public cyrillicToLatin(word: string): string {
    if (!this.objectHelperService.isDefined(word)) {
      return undefined;
    }

    let newStr = '';

    for (const char of word) {
      const isUpperCase = char === char.toUpperCase();
      const translitChar = LETTERS[char.toLowerCase()];
      if (translitChar === undefined) {
        newStr += char;
      } else {
        newStr += isUpperCase ? translitChar.toUpperCase() : translitChar;
      }
    }
    return newStr;
  }
}
