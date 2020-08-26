import { Pipe, PipeTransform } from '@angular/core';
import { StatusType } from '../models/car-info.interface';

const STATUS_MAP = {
  REGISTERED: 'Состоит на государственном учете',
  NOT_REGISTERED: 'Не состоит на государственном учете',
  REMOVED: 'Снято с государственного учета',
  SUSPENDED: 'Учет приостановлен',
};

@Pipe({ name: 'carInfoStatus' })
export class CarInfoStatusPipe implements PipeTransform {
  transform(value: StatusType): string {
    return STATUS_MAP[value];
  }
}
