import { Injectable } from '@angular/core';

@Injectable()
export class JsonHelperService {

  public hasJsonStructure(string: string): boolean {
    if (typeof string !== 'string') return false;
    try {
      const result = JSON.parse(string);
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]' || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }

  public tryToParse(value: string|object|[], defaultValue: unknown = ''): unknown {
    if (Array.isArray(value) || typeof value === 'object' && value) {
      return value;
    }

    if (this.hasJsonStructure(value as string)) {
      return JSON.parse(value as string);
    }

    return defaultValue;
  }
}
