import { Injectable } from '@angular/core';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { TypeHelperService } from '../type-helper/type-helper.service';


@Injectable()
export class UtilsService {
  constructor (private typeHelperService: TypeHelperService) {}

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const travel = (regexp): any =>
      String.prototype.split
        .call(path, regexp)
        .filter(Boolean)
        .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === obj ? defaultValue : result;
  }

  static extractDateRef(refDate: string): string[] {
    const ref = refDate.match(/^[\.\w]{0,}/gim)[0];
    return [ref, refDate.replace(ref, '')];
  }

  /**
   * Функция возвращает ключ для получения словаря
   * @param component экземпляр компонента
   */
  public static getDictKeyByComp(component: ComponentDto): string {
    return component.attrs.dictionaryType + component.id;
  }

  public static htmlToText(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body ? doc.body.textContent : '';
  }

  public static hasJsonStructure(string: string): boolean {
    if (typeof string !== 'string') return false;
    try {
      const result = JSON.parse(string);
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]' || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }

  public static tryToParse(JSONstring: string): unknown | '' {
    if (this.hasJsonStructure(JSONstring)) {
      return JSON.parse(JSONstring);
    } else {
      return '';
    }
  }

  public tryToParseOrDefault(value: string|object|[], defaultValue: object = {}): object|[] {
    if (Array.isArray(value) || typeof value === 'object' && value) {
      return value;
    }

    if (UtilsService.hasJsonStructure(value as string)) {
      return JSON.parse(value as string);
    }

    return defaultValue;
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

  /**
   * Returns modified service name in camelCase format
   * Example:
   * https://www.gosuslugi.ru/600101/1/form-item -> form-item -> formItem
   * https://www.gosuslugi.ru/600101/1/form_item -> form_item -> formItem
   * https://www.gosuslugi.ru/600101/1/form -> form -> form
   * @param url
   * @param sliceFrom
   */
  public getServiceName(url: string, sliceFrom: number = 3): string {
    const numRegex = /^\d+$/;
    const splittedUrl = this.getSplittedUrl(url);

    let preparedArray = this.sliceArrayFromRight(splittedUrl, sliceFrom);

    if (numRegex.test(preparedArray[0])) {
      preparedArray = this.sliceArrayFromRight(preparedArray, sliceFrom, false);
    }

    preparedArray = preparedArray.map((urlPath) => (numRegex.test(urlPath) ? '' : urlPath));

    const serviceName = preparedArray.join('-');
    const camelCasedServiceName = serviceName.replace(/(?:^_-\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    });
    const cleanCamelCasedServiceName = camelCasedServiceName.replace(/[-_\s]+/g, '');

    return `${cleanCamelCasedServiceName}Service`;
  }

  /**
   * Returns a boolean value if url is an instance of a string type
   * @param url
   */
  public isValidHttpUrl(url: string | undefined): boolean {
    return url && typeof url === 'string';
  }

  public filterIncorrectObjectFields(obj: object): object {
    return Object.entries(obj).reduce(
      (a, [k, v]) => (!this.typeHelperService.isDefined(v) ? a : ((a[k] = v), a)),
      {},
    );
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

  private sliceArrayFromRight(arr: string[], from: number, includeFirst: boolean = true): string[] {
    return arr.slice(Math.max(arr.length - from, includeFirst ? 0 : 1));
  }
}
