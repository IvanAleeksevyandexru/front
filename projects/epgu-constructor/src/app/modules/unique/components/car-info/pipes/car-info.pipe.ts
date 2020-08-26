import { Pipe, PipeTransform } from '@angular/core';
import { LegalInfo }from '../models/car-info.interface';

const LEGAL_MAP = {
  PLEDGED: 'Находится в залоге',
  WANTED: 'Находится в розыске',
  RESTRICTIONS: 'Ограничения на регистрацию',
};

@Pipe({ name: 'carInfoLegal' })
export class CarInfoLegalPipe implements PipeTransform {
  transform(value: LegalInfo): string {
    return LEGAL_MAP[value];
  }
}
