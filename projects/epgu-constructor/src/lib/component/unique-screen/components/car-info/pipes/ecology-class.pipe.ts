import { Pipe, PipeTransform } from '@angular/core';

enum EcologyClass {
  'Первый' = 1,
  'Второй' = 2,
  'Третий' = 3,
  'Четвертый' = 4,
  'Пятый' = 5,
}

@Pipe({
  name: 'ecologyClass',
})
export class EcologyClassPipe implements PipeTransform {
  transform(ecologyNumber: string | number | undefined): string {
    return EcologyClass[ecologyNumber] || null;
  }
}
