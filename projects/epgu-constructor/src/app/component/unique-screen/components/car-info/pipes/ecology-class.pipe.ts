import { Pipe, PipeTransform } from '@angular/core';

enum EcologyClass {
  'Первый' = 1,
  'Второй',
  'Третий',
  'Четвертый',
  'Пятый',
}

@Pipe({
  name: 'ecologyClass'
})
export class EcologyClassPipe implements PipeTransform {

  transform(ecologyNumber: string | number): string {
    if(ecologyNumber) {
      return EcologyClass[ecologyNumber] || null;
    }
    return null;
  }

}
