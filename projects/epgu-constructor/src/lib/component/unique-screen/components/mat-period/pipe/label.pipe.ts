import { Pipe, PipeTransform } from '@angular/core';
import { FormField, PaymentType } from '../mat-period.models';

@Pipe({
  name: 'label',
})
export class LabelPipe implements PipeTransform {
  transform(label: { [key in FormField]: string }, type: PaymentType): string {
    return label[type] || label['default'];
  }
}
