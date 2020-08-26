import { Pipe, PipeTransform } from '@angular/core';
import { OwnerType } from  '../models/car-info.interface';

const OWNER_MAP = {
  INDIVIDUAL: 'Физическое лицо',
  LEGAL_ENTITY: 'Юридическое лицо',
};

@Pipe({ name: 'carInfoOwner' })
export class CarInfoOwnerPipe implements PipeTransform {
  transform(value: OwnerType): string {
    return OWNER_MAP[value];
  }
}
