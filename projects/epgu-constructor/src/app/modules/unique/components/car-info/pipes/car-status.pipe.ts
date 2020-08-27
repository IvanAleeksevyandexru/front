import { Pipe, PipeTransform } from '@angular/core';
import { StatusType } from '../models/car-info.interface';
import { STATUS_MAP } from './mapping/car-info.mapping';

@Pipe({ name: 'carInfoStatus' })
export class CarInfoStatusPipe implements PipeTransform {
  transform(value: StatusType): string {
    return STATUS_MAP[value];
  }
}
