import { Pipe, PipeTransform } from '@angular/core';

const LEGAL_MAP = {
  pledged: 'Находится в залоге',
  wanted: 'Находится в розыске',
  restrictions: 'Ограничения на регистрацию',
};

@Pipe({ name: 'carInfoLegal' })
export class CarInfoLegalPipe implements PipeTransform {
  transform(value: string): string {
    return LEGAL_MAP[value];
  }
}
