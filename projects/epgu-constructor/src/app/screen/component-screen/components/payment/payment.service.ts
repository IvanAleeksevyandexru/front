import { Injectable } from '@angular/core';
import { DictionaryApiService } from '../../../../services/dictionary-api/dictionary-api.service';
import { HttpClient } from '@angular/common/http';
import { ConstructorConfigService } from '../../../../services/config/constructor-config.service';
import { catchError, map } from 'rxjs/operators';
import { PaymentDictionaryOptionsInterface, PaymentInfoInterface } from '../../../../../interfaces/payment.interface';
import { Observable, throwError } from 'rxjs';
import { getPaymentRequestOptions } from './payment.constants';

/**
 * Сервис для оплаты услуг пользователем
 */
@Injectable()
export class PaymentService {
  private apiUrl: string;
  private externalUrl: string;
  private paymentUrl: string;

  constructor(
    private dictionaryApiService: DictionaryApiService,
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService,
  ) {
    this.apiUrl = this.constructorConfigService.config.apiUrl;
    this.externalUrl = this.constructorConfigService.config.externalUrl;
    this.paymentUrl = this.constructorConfigService.config.paymentUrl;
  }

  /**
   * Преобразует сумму строкой без запятой в строку суммы с копейками
   * @param sum - сумма для трансформации
   * @example
   * '7000' => "70,00"
   * @example
   * '001' => "0,01"
   */
  static transformSumForPenny(sum): string {
    return sum.padEnd(3, '0').replace(/\d{2}$/, ',$&');
  }

  /**
   * Загружает данные по оплате с реквизитами
   * @param orderId - идентификатор заявления
   * @param nsi - наименование справочника с информацией
   * @param dictItemCode - код нужного справочника
   * @param filterReg - объект фильтра для оплаты
   */
  loadPaymentInfo(orderId, nsi, dictItemCode, filterReg): Observable<any> {
    const dictionaryOptions = this.createPaymentRequestOptions(dictItemCode, filterReg);

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
   * Получение номера УИН для по номеру заявки
   * @param orderId - идентификатор заявления
   * @param attributeValues - дополнительные параметры
   */
  getUinByOrderId(orderId: string, attributeValues: PaymentInfoInterface): Observable<any> {
    return this.http.post(
      `${this.externalUrl}api/lk/v1/paygate/uin/1?orderId=${orderId}`,
      attributeValues,
      {
        withCredentials: true
      },
    );
  }

  /**
   * Возвращает ссылку на оплату для перехода пользователя
   *
   * @param uin - уникальный идентификатор патедя
   */
  getPaymentLink(uin: string): string {
    // TODO хардкод. доделать.
    // eslint-disable-next-line prettier/prettier
    return `${this.paymentUrl}/?billNumber=${uin}&returnUrl=${encodeURIComponent(this.apiUrl)}&subscribe=true`;
  }

  /**
   * Возвращает опции для запроса на оплату
   * @param dictItemCode - код элемента справочника на оплату
   * @param filterReg - объект фильтра для оплаты
   */
  createPaymentRequestOptions(dictItemCode: string, filterReg: any): PaymentDictionaryOptionsInterface {
    console.log('filterReg', filterReg);
    // TODO хардкод. доделать. Выглядит как
    return getPaymentRequestOptions(filterReg, dictItemCode);
  }
}
