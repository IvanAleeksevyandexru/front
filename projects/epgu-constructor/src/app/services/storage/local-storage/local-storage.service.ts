import { Injectable } from '@angular/core';
import { AbstractStorage } from '../abstract-storage';

@Injectable()
export class LocalStorageService extends AbstractStorage{

  constructor() {
    super();
  }

  clear(): void {
    localStorage.clear();
  }

  getItem(key: string, parse: boolean): string | null {
    if (parse) {
      const item = localStorage.getItem(key);
      return JSON.parse(item);
    } else {
      return localStorage.getItem(key);
    }
  }

  key(index: number): string | null {
    return localStorage.key(index);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}
