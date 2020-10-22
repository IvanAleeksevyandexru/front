import { Injectable } from '@angular/core';
import { AbstractStorage } from '../abstract-storage';

@Injectable()
export class CookieStorageService extends AbstractStorage{

  constructor() {
    super();
  }

  clear(): void {
    document.cookie.split(';').forEach(cookieItem => {
      const [cookieName, _] = cookieItem.split('=');
      this.removeItem(cookieName);
    });
  }

  getItem(key: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    } else {
      return undefined;
    }
  }

  key(index: number): string | null {
    return undefined;
  }

  removeItem(key: string): void {
    document.cookie = `${key} =; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }

  setItem(key: string, value: string): void {
    document.cookie = `${key}=${value}`;
  }
}
