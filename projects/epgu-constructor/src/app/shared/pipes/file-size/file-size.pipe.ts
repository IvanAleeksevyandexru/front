import { Pipe, PipeTransform } from '@angular/core';
import { getSizeInMB } from '../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';

@Pipe({
  name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {
  transform(value: number): string {
    const sizeInMB = getSizeInMB(value);
    return `${(sizeInMB < 0.1 ? 0.1 : sizeInMB).toFixed(1)} МБ`;
  }
}
