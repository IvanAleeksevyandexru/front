import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { HttpClient } from '@angular/common/http';
import { ConstructorConfigService } from '../config/constructor-config.service';
import { catchError, map } from 'rxjs/operators';
import {
  BillsInfoResponse,
  PaymentDictionaryOptionsInterface,
  PaymentInfoInterface
} from '../../../interfaces/payment.interface';
import { Observable, throwError } from 'rxjs';
import { FormPlayerService } from '../../form-player.service';
import { getPaymentRequestOptions } from '../../screen/component-screen/components/payment/payment.constants';

/**
 * Сервис для оплаты услуг пользователем
 */
@Injectable()
export class PaymentService {
  private apiUrl: string;
  private externalUrl: string;
  private paymentUrl: string;
  isLocalHost = false;

  constructor(
    private restService: RestService,
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService,
    public formPlayerService: FormPlayerService,
  ) {
    this.apiUrl = this.constructorConfigService.config.apiUrl;
    this.externalUrl = this.constructorConfigService.config.externalUrl;
    this.paymentUrl = this.constructorConfigService.config.paymentUrl;
    this.isLocalHost = location.hostname === 'localhost';
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
   * Возвращает путь API адреса для обращений к сервису TERABYTE
   *
   * @param relativePath - относительный путь от API для запросов
   */
  private getPayInfoApiUrl = (relativePath): string =>
    (this.isLocalHost ? '/paymentuin/' : this.externalUrl) + relativePath;

  /**
   * Загружает данные по оплате с реквизитами
   * @param orderId - идентификатор заявления
   * @param nsi - наименование справочника с информацией
   * @param dictItemCode - код нужного справочника
   */
  loadPaymentInfo(orderId, nsi, dictItemCode): Observable<any> {
    const dictionaryOptions = this.createPaymentRequestOptions(dictItemCode);

    return this.restService.getDictionary(nsi, dictionaryOptions).pipe(
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
  getUinByOrderId(orderId: string, code: number = 1, attributeValues: PaymentInfoInterface): Observable<any> {
    return this.http.post(
      this.getPayInfoApiUrl(`api/lk/v1/paygate/uin/${code}?orderId=${orderId}`),
      attributeValues,
      {
        withCredentials: true
      },
    ).pipe(
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
  getBillsInfoByUIN(uin: string, orderId: string): Observable<any> {
    return this.http.post(
      this.getPayInfoApiUrl(`api/pay/v1/bills?billNumber=${uin}&ci=false&senderTypeCode=ORDER&subscribe=true&epgu_id=${orderId}`), {},
      {
        withCredentials: true
      },
    ).pipe(
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
  getPaymentStatusByUIN(orderId: string, code: number = 1): Observable<any> {
    return this.http.get(
      this.getPayInfoApiUrl(`api/lk/v1/paygate/uin/status/${code}?orderId=${orderId}`),
      {
        withCredentials: true
      },
    ).pipe(
      catchError((err: any) => {
        return throwError(err);
      }),
    );
  }

  /**
   * Возвращает ссылку на оплату для перехода пользователя
   *
   * @param uin - уникальный идентификатор патежа
   */
  getPaymentLink(uin: string): string {
    // TODO хардкод. доделать.
    // eslint-disable-next-line prettier/prettier
    return `${this.paymentUrl}/?billNumber=${uin}&returnUrl=${encodeURIComponent(this.apiUrl)}&subscribe=true`;
  }

  /**
   * Возвращает опции для запроса на оплату
   * @param dictItemCode - код элемента справочника на оплату
   */
  createPaymentRequestOptions(dictItemCode: string): PaymentDictionaryOptionsInterface {
    const { applicantAnswers }: any = this.formPlayerService.responseStore.scenarioDto;
    // eslint-disable-next-line prettier/prettier
    const filterReg = JSON.parse(applicantAnswers.ms1.value);

    console.log('filterReg', filterReg);
    // TODO хардкод. доделать.
    return getPaymentRequestOptions(filterReg, dictItemCode);
  }
}
