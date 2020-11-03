import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { paymentNSIType } from './payment.constants';
import { ConfigService } from '../../../../core/config/config.service';
import { PaymentInfoInterface } from './payment.types';
import { PaymentRegisterMarriageService } from './subservices/register.marriage.service';
import { PaymentRegisterVehicleService } from './subservices/register.vehicle.service';

/**
 * Сервис для оплаты услуг пользователем
 */
@Injectable()
export class PaymentService {
  public requestOptions = { withCredentials: true };

  constructor(
    public http: HttpClient,
    public config: ConfigService,
    public paymentRegisterMarriageService: PaymentRegisterMarriageService,
    public paymentRegisterVehicleService: PaymentRegisterVehicleService,
  ) {}

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
   * @param attrs - объект с аттрибутами компонента
   */
  loadPaymentInfo(attrs: any): Observable<any> {
    const { nsi } = attrs;

    switch (nsi){ //Код справочника о услуге
      case paymentNSIType.REGISTER_VEHICLE:
        return this.paymentRegisterVehicleService.loadPaymentInfo(nsi, attrs);
        break;
      case paymentNSIType.REGISTER_MARRIAGE:
      default:
        return this.paymentRegisterMarriageService.loadPaymentInfo(nsi, attrs);
        break;
    }
  }

  /**
   * Получение номера УИН для по номеру заявки
   * @param orderId - идентификатор заявления
   * @param code - идентификатор заявителя
   * @param attributeValues - дополнительные параметры
   */
  getUinByOrderId(orderId: string, code: number = 1, attributeValues: PaymentInfoInterface): Observable<any> {
    // TODO: Хардкод для локальной отладки подмена суммы оплаты пошлины
    if (location.hostname.includes('test.gosuslugi.ru')) {
      attributeValues.sum = '200';
    }

    const urlPrefix = this.config.mocks.includes('payment')
      ? `${this.config.mockUrl}/lk/v1/paygate/uin`
      : this.config.uinApiUrl;
    const path = `${urlPrefix}/${code}?orderId=${orderId}`;
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
  getBillsInfoByUIN(uin: string, orderId: string): Observable<any> {
    // На случай если сервис лежит, только для теста
    // const billMockUp = new BehaviorSubject(mockUpBillsInfo);
    // return billMockUp.asObservable();

    const urlPrefix = this.config.mocks.includes('payment')
      ? `${this.config.mockUrl}/pay/v1/bills`
      : `${this.config.billsApiUrl}bills`;
    // eslint-disable-next-line max-len
    const path = `${urlPrefix}?billNumber=${uin}&returnUrl=${this.getReturnUrl()}&ci=false&senderTypeCode=ORDER&subscribe=true&epgu_id=${orderId}`;
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
  getPaymentStatusByUIN(orderId: string, code: number = 1): Observable<any> {
    const urlPrefix = this.config.mocks.includes('payment')
      ? `${this.config.mockUrl}/lk/v1/paygate/uin`
      : this.config.uinApiUrl;
    const path = `${urlPrefix}/status/${code}?orderId=${orderId}`;
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
}
