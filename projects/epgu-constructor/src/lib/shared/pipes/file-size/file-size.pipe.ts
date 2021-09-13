import { Pipe, PipeTransform } from '@angular/core';
import { getSizeInMB, getSizeInKB } from '../../components/file-upload/data';

@Pipe({
  name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {
  transform(value: number): string {
    const sizeInMB = getSizeInMB(value);
    return sizeInMB < 0.1 ? `${getSizeInKB(value)} Кб` : `${sizeInMB.toFixed(1)} Мб`;
  }
}
