import { Pipe, PipeTransform } from '@angular/core';
import { LegalInfo }from '../models/car-info.interface';
import { LEGAL_MAP } from './mapping/car-info.mapping';

@Pipe({ name: 'carInfoLegal' })
export class CarInfoLegalPipe implements PipeTransform {
  transform(value: LegalInfo): string {
    return LEGAL_MAP[value];
  }
}
