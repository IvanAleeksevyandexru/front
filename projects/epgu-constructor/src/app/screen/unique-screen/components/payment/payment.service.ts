import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { getPaymentRequestOptions, mockUpUIN } from './payment.constants';
import { DictionaryApiService } from '../../../../services/api/dictionary-api/dictionary-api.service';
import { ScreenStore } from '../../../screen.types';
import { ScreenService } from '../../../screen.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { ConfigService } from '../../../../config/config.service';
import { PaymentDictionaryOptionsInterface, PaymentInfoInterface } from './payment.types';

/**
 * Сервис для оплаты услуг пользователем
 */
@Injectable()
export class PaymentService {
  private requestOptions = { withCredentials: true };
  screenStore: ScreenStore;

  constructor(
    private http: HttpClient,
    private dictionaryApiService: DictionaryApiService,
    private config: ConfigService,
    private screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService
  ) {
    this.screenService.screenData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((screenData: ScreenStore) => {
        this.screenStore = screenData;
      });
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
   * @param fiasCode - код справочника
   */
  loadPaymentInfo(orderId, nsi, dictItemCode, fiasCode): Observable<any> {
    const dictionaryOptions = this.createPaymentRequestOptions(dictItemCode, fiasCode);

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

  //TODO: Идентификатор заявителя ниже должен откуда-то браться
  /**
   * Получение номера УИН для по номеру заявки
   * @param orderId - идентификатор заявления
   * @param code - идентификатор заявителя
   * @param attributeValues - дополнительные параметры
   */
  getUinByOrderId(orderId: number, code: number = 1, attributeValues: PaymentInfoInterface): Observable<any> {
    // TODO: HARDCODE Специальная подмена на оплату 1,4 рубля гос пошлины, иначе будет как есть снятие
    if (location.hostname === 'local.test.gosuslugi.ru') {
      const uinMockUp = new BehaviorSubject({
        value: mockUpUIN
      });
      return uinMockUp.asObservable();
    }

    const path = `${this.config.uinApiUrl}/${code}?orderId=${orderId}`;
    return this.http.post(path, attributeValues, this.requestOptions).pipe(
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }

  /**
   * Получение данных (предначисления) по УИН, полная информация
   * @param uin - уникальный идентификатор патежа
   * @param orderId - идентификатор заявления
   */
  getBillsInfoByUIN(uin: string, orderId: number): Observable<any> {
    // На случай если сервис лежит, только для теста
    // const billMockUp = new BehaviorSubject(mockUpBillsInfo);
    // return billMockUp.asObservable();

    // eslint-disable-next-line max-len
    const path = `${this.config.billsApiUrl}?billNumber=${uin}&urlReturnCheck=${this.getReturnUrl()}&ci=false&senderTypeCode=ORDER&subscribe=true&epgu_id=${orderId}`;
    return this.http.post(path, {}, this.requestOptions).pipe(
      catchError((err: any) => {
        return throwError(err);
      }),
    );
  }

  /**
   * Получение статуса платежа по УИН, полная информация
   * @param orderId - идентификатор заявления
   * @param code - идентификатор заявителя
   */
  getPaymentStatusByUIN(orderId: number, code: number = 1): Observable<any> {
    const path = `${this.config.uinApiUrl}/status/${code}?orderId=${orderId}`;
    return this.http.get(path, this.requestOptions).pipe(
      catchError((err: any) => {
        return throwError(err);
      }),
    );
  }

  /**
   * Возвращает адрес куда нужно сделать возврат
   */
  getReturnUrl(): string {
    const slashInEndRex = /\/$/;
    const host = location.href.replace(slashInEndRex,'');
    return encodeURIComponent(`${host}?getLastScreen=1`);
  }

  /**
   * Возвращает ссылку на оплату для перехода пользователя
   *
   * @param billId - уникальный идентификатор патежа
   */
  getPaymentLink(billId: number): string {
    return `${this.config.paymentUrl}/?billIds=${billId}&returnUrl=${this.getReturnUrl()}&subscribe=true`;
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

  /**
   * Возвращает опции для запроса на оплату
   * @param dictItemCode - код элемента справочника на оплату
   * @param fiasCode - код справочника
   */
  createPaymentRequestOptions(dictItemCode: string, fiasCode: string): PaymentDictionaryOptionsInterface {
    const { applicantAnswers } = this.screenStore;
    const path = fiasCode.split('.'); // Путь к ответу
    const filterReg = JSON.parse(this.getValueFromObjectAsArray(applicantAnswers, path));

    return getPaymentRequestOptions(filterReg, dictItemCode);
  }
}
