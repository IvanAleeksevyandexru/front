import { Injectable } from '@angular/core';

@Injectable()
export class DateRefService {
  extract(refDate: string): string[] {
    const ref = refDate.match(/^[\.\w]{0,}/gim)[0];
    return [ref, refDate.replace(ref, '')];
  }
}
