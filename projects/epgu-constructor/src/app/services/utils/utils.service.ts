import { Injectable } from '@angular/core';
import { Moment } from 'moment';

@Injectable()
export class UtilsService {
  // TODO: add shared utils

  /**
   * Получает данные JSON из LocalStorage по ключу
   * @param key - ключ хранилища
   */
  static getLocalStorageJSON(key: string): any | null {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
  }

  /**
   * Устанавливае данные JSON в LocalStorage по ключу
   * @param key - ключ хранилища
   * @param data - данные для сохранения
   */
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
  static getCookie(name) {
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
  static removeCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  /**
   * Метод для безопасного получения пропертей объекта по пути
   * @param obj объект, из которого необходимо получить свойство
   * @param path путь до свойства
   * @param defaultValue значение по умолчанию в случае не нахождения свойства
   * @example getObjectProperty({a: {b: {c: 3}}}), 'a.b.c');
   */
  static getObjectProperty(obj: any, path: string, defaultValue: any = undefined): any {
    const travel = (regexp) =>
      String.prototype.split
        .call(path, regexp)
        .filter(Boolean)
        .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === obj ? defaultValue : result;
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
   * Скачивание файла
   */
  public downloadFile(blob: Blob) {
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
}
