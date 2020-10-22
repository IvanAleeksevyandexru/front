import { Injectable } from '@angular/core';
import { AbstractStorage } from '../abstract-storage';

@Injectable()
export class SessionStorageService extends AbstractStorage {

  constructor() {
    super();
  }

  // eslint-disable-next-line no-empty-function
  clear(): void {
  }

  getItem(key: string, options: any): string | null {
    return null;
  }

  key(index: number): string | null {
    return null;
  }

  // eslint-disable-next-line no-empty-function
  removeItem(key: string): void {
  }

  // eslint-disable-next-line no-empty-function
  setItem(key: string, value: string): void {
  }
}
