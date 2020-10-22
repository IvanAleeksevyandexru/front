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
    return undefined;
  }

  key(index: number): string | null {
    return undefined;
  }

  // eslint-disable-next-line no-empty-function
  removeItem(key: string): void {
  }

  setItem(key: string, value: string): void {
  }
}
