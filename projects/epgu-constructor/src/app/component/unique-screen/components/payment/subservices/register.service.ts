import { Injectable } from '@angular/core';
import { PaymentDictionaryOptionsInterface } from '../payment.types';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DictionaryApiService } from '../../../../shared/services/dictionary-api/dictionary-api.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ConfigService } from '../../../../../core/config/config.service';
import { getPaymentRequestOptions } from '../payment.constants';

/**
 * Класс для информации о регистрации брака для оплаты
 */
@Injectable()
export class PaymentRegisterService{

  constructor(
    public dictionaryApiService: DictionaryApiService,
    public screenService: ScreenService,
    public config: ConfigService,
  ) {}

  /**
   * Загружает информацию из справочников для оплаты
   * @param nsi - код справочника
   * @param attrs - аттрибуты
   */
  getDictionaryInfo(nsi: string, attrs: any): Observable<any> {
    const dictionaryOptions = this.createPaymentRequestOptions(attrs);

    return this.dictionaryApiService.getDictionary(nsi, dictionaryOptions).pipe(
      map((res: any) => {
        if (res.error.code === 0) {
          return res.items[0].attributeValues;
        }
        throw Error();
      }),
      catchError((err: any) => {
        return throwError(err);
      }),
    );
  }

  /**
   * Возвращает опции для запроса на оплату
   * @param attrs - аттрибуты компонента
   */
  createPaymentRequestOptions(attrs: any): PaymentDictionaryOptionsInterface {
    const { applicantAnswers } = this.screenService;
    const { ref } = attrs;
    const { fiasCode } = ref;
    const path = fiasCode.split('.'); // Путь к ответу
    const filterReg = JSON.parse(this.getValueFromObjectAsArray(applicantAnswers, path));

    return getPaymentRequestOptions(filterReg, attrs, this.config);
  }

  /**
   * Возращает значение из объекта по массиву переданных ключей
   * @param obj_or_result - объект или значение объекта
   * @param path - массив с путём ключей
   * @private
   */
  private getValueFromObjectAsArray(obj_or_result: any, path: string[]): string | null {
    if (path.length){
      const key = path.shift();
      if (obj_or_result.hasOwnProperty(key)){
        return this.getValueFromObjectAsArray(obj_or_result[key], path);
      }
      return null;
    }
    return obj_or_result;
  }
}
