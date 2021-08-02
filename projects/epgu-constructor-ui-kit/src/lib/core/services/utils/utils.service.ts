import { Injectable } from '@angular/core';
import { TypeHelperService } from '../type-helper/type-helper.service';


@Injectable()
export class UtilsService {
  constructor (private typeHelperService: TypeHelperService) {}

  public filterIncorrectObjectFields(obj: object): object {
    return Object.entries(obj).reduce(
      (a, [k, v]) => (!this.typeHelperService.isDefined(v) ? a : ((a[k] = v), a)),
      {},
    );
  }

  /**
   * Скачивание файла
   */
  public downloadFile({ value, type }: { value: string; type: string }): void {
    const blob = new Blob([value], { type });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', 'file');
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 200);
  }
}
