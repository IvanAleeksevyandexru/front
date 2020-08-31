import { Pipe, PipeTransform } from '@angular/core';
import { OwnerType } from  '../models/car-info.interface';
import { OWNER_MAP } from './mapping/car-info.mapping';

@Pipe({ name: 'carInfoOwner' })
export class CarInfoOwnerPipe implements PipeTransform {
  transform(value: OwnerType): string {
    return OWNER_MAP[value];
  }
}
