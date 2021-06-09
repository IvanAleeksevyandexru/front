import { Pipe, PipeTransform } from '@angular/core';

const ERROR_TEMPLATE = {
  NOT_FOUND_ERROR: { title: 'Данные не найдены', icon: 'info-list-yellow-warning-icon' },
  EXTERNAL_SERVER_ERROR: { title: 'Ошибка загрузки данных', icon: 'info-list-red-warning-icon' },
};

@Pipe({
  name: 'errorTemplate',
})
export class ErrorTemplatePipe implements PipeTransform {
  transform(value: string): { title: string; icon: string } {
    return ERROR_TEMPLATE[value] ? ERROR_TEMPLATE[value] : {};
  }
}
