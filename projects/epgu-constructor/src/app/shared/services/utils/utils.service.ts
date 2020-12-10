import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { CustomComponent } from '../../../component/components-list/components-list.types';
import { ScenarioDto } from '../../../form-player/services/form-player-api/form-player-api.types';

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
export class UtilsService {
  // TODO: add shared utils

  /**
   * Получает данные JSON из LocalStorage по ключу
   * @param key - ключ хранилища
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getLocalStorageJSON(key: string): any | null {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
  }

  /**
   * Устанавливае данные JSON в LocalStorage по ключу
   * @param key - ключ хранилища
   * @param data - данные для сохранения
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static setLocalStorageJSON(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Удаляет из хранилища Local Storage по ключу
   * @param key
   */
  static deleteFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * Устанавливает куку
   * @param name - имя куки
   * @param value - значение куки
   * @param days - количество дней на установку
   * @param domain - домен, к которому записывается кука
   */
  static setCookie(name: string, value: string | number, days: number, domain: string = '') {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    let cookie = `${name}=${value || ''}${expires}; path=/`;
    if (domain.length) {
      cookie += `; domain=${domain};`;
    }
    document.cookie = cookie;
  }

  /**
   * Получает куку с нужным именем
   * @param name - имя куки
   */
  static getCookie(name: string) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  /**
   * Удаляет куку с нужным именем
   * @param name - имя куки
   */
  static removeCookie(name: string) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  /**
   * Метод для безопасного получения пропертей объекта по пути
   * @param obj объект, из которого необходимо получить свойство
   * @param path путь до свойства
   * @param defaultValue значение по умолчанию в случае не нахождения свойства
   * @example getObjectProperty({a: {b: {c: 3}}}), 'a.b.c');
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getObjectProperty(obj: any, path: string, defaultValue: any = undefined): any {
    if (!path) return obj;

    const travel = (regexp) =>
      String.prototype.split
        .call(path, regexp)
        .filter(Boolean)
        .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === obj ? defaultValue : result;
  }

  /**
   * Функция возвращает ключ для получения словаря из ComponentListRepositoryService
   * @param component экземпляр компонента
   */
  public static getDictKeyByComp(component: CustomComponent): string {
    return component.attrs.dictionaryType + component.id;
  }

  /**
   * Форматирует объект moment даты в нужны формат и возвращает его
   * @param date - объект даты обёрнутый в библитеку moment
   * @param format - формат в котором выводить дату (из документации к moment.js)
   */
  public formatDate(date: Moment, format: string): string {
    return date.format(format);
  }

  public getDeclension(num: number, forms: string[]): string {
    const num0 = Math.abs(num) % 100;
    const n1 = num0 % 10;

    if (num0 > 10 && num0 < 20) {
      return forms[2];
    }

    if (n1 > 1 && n1 < 5) {
      return forms[1];
    }

    if (n1 === 1) {
      return forms[0];
    }

    return forms[2];
  }
  /**
   * Returns url separated by subdirectories and query parameters
   * @param url
   */
  public getSplittedUrl(url: string): string[] {
    const splitByQueryParam = url.split('?');
    const splitByDirLocation = splitByQueryParam[0].split('/');

    return splitByDirLocation;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sliceArrayFromRight(arr: any[], from: number, includeFirst: boolean = true) {
    return arr.slice(Math.max(arr.length - from, includeFirst ? 0 : 1));
  }

  /**
   * Converts cyrillic to latin
   * @param str
   */
  public cyrillicToLatin(word: string): string {

    if (!this.isDefined(word)) {
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

  /**
   * Returns modified service name in camelCase format
   * Example:
   * https://www.gosuslugi.ru/600101/1/form-item -> form-item -> formItemService
   * https://www.gosuslugi.ru/600101/1/form_item -> form_item -> formItemService
   * https://www.gosuslugi.ru/600101/1/form -> form -> formService
   * @param url
   */
  public getServiceName(url: string): string {
    const numRegex = /^\d+$/;
    const splittedUrl = this.getSplittedUrl(url);

    let preparedArray = this.sliceArrayFromRight(splittedUrl, 3);

    preparedArray = numRegex.test(preparedArray[0]) ? this.sliceArrayFromRight(preparedArray, 3, false) : preparedArray;
    preparedArray = preparedArray.map(urlPath => numRegex.test(urlPath) ? '' : urlPath);

    const serviceName = preparedArray.join('-');

    return `${serviceName.replace(/(?:^_-\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/[-_\s]+/g, '')}Service`;
  }


  /**
   * Returns a boolean value if url is an instance of a string type
   * @param url
   */
  public isValidHttpUrl(url: string | undefined): boolean {
    return url && typeof url === 'string';
  }

  public isValidScenarioDto(dto: { scenarioDto: ScenarioDto }): boolean {
    return dto && dto.scenarioDto && !!dto.scenarioDto.display;
  }

  public isDefined<T>(value: T | undefined | null): value is T {
    return (value as T) !== undefined && (value as T) !== null;
  };

  public filterIncorrectObjectFields(obj: object): object {
    return Object.entries(obj).reduce(
      (a, [k,v]) => (!this.isDefined(v) ? a : (a[k] = v, a)), {}
    );
  }

  public isValidOrderId(orderId: number | undefined | string): boolean {
    return !!orderId;
  }

  /**
   * Скачивание файла
   */
  public downloadFile({ value, type }: { value: string; type: string }): void {
    const blob = new Blob([value], { type });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', 'file');
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 200);
  }

  public hasJsonStructure(string: string): boolean {
    if (typeof string !== 'string') return false;
    try {
        const result = JSON.parse(string);
        const type = Object.prototype.toString.call(result);
        return type === '[object Object]'
            || type === '[object Array]';
    } catch (err) {
        return false;
    }
}
}
