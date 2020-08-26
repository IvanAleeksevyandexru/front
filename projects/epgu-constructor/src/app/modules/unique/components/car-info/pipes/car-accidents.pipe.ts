import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'carInfoAccidents' })
export class CarInfoAccidentsPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: number): string {
    const html = value > 0 ? `В ГИБДД есть данные об авариях: <span style="font-weight:bold;">${value} ДТП</span>` : 'В ГИБДД нет данных об авариях';
    return this.sanitizer.bypassSecurityTrustHtml(html) as string;
  }
}
