import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../../core/config/config.service';
import {
  BillsInfoResponse,
  PaymentDictionaryOptionsInterface,
  PaymentInfoForPaidStatusData,
  PaymentInfoInterface
} from './payment.types';
import { getPaymentRequestOptions } from './payment.constants';
import { DictionaryApiService } from '../../../shared/services/dictionary-api/dictionary-api.service';
import { ScreenService } from '../../../../screen/screen.service';
import { PaymentsAttrs } from './abstractpayment.component';

/**
 * Сервис для оплаты услуг пользователем
 */
@Injectable()
export class PaymentService {
  public requestOptions = { withCredentials: true };

  constructor(
    public http: HttpClient,
    public config: ConfigService,
    public dictionaryApiService: DictionaryApiService,
    public screenService: ScreenService
  ) {}

  /**
   * Преобразует сумму строкой без запятой в строку суммы с копейками
   * @param sum - сумма для трансформации
   * @example
   * '7000' => "70,00"
   * @example
   * '001' => "0,01"
   */
  static transformSumForPenny(sum: string): string {
    return sum.padEnd(3, '0').replace(/\d{2}$/, ',$&');
  }

  /**
   * Загружает данные по оплате с реквизитами
   * @param attrs - объект с аттрибутами компонента
   */
  loadPaymentInfo(attrs: PaymentsAttrs): Observable<PaymentInfoInterface> {
    return this.getDictionaryInfo(attrs);
  }

  /**
   * Получение номера УИН для по номеру заявки
   * @param orderId - идентификатор заявления
   * @param code - идентификатор заявителя
   * @param attributeValues - дополнительные параметры
   */
  getUinByOrderId(orderId: string, code: number = 1, attributeValues: PaymentInfoInterface): Observable<{ value: string }> {
    // TODO: Хардкод для локальной отладки подмена суммы оплаты пошлины
    if (location.hostname.includes('test.gosuslugi.ru')) {
      attributeValues.sum = '200';
    }

    const urlPrefix = this.config.mocks.includes('payment')
      ? `${this.config.mockUrl}/lk/v1/paygate/uin`
      : this.config.uinApiUrl;
    const path = `${urlPrefix}/${code}?orderId=${orderId}`;
    return this.http.post<{ value: string }>(path, attributeValues, this.requestOptions);
  }

  /**
   * Получение данных (предначисления) по УИН, полная информация
   * @param uin - уникальный идентификатор патежа
   * @param orderId - идентификатор заявления
   */
  getBillsInfoByUIN(uin: string | number, orderId: string): Observable<BillsInfoResponse> {
    const urlPrefix = this.config.mocks.includes('payment')
      ? `${this.config.mockUrl}/pay/v1/bills`
      : `${this.config.billsApiUrl}bills`;
    // eslint-disable-next-line max-len
    const path = `${urlPrefix}?billNumber=${uin}&returnUrl=${this.getReturnUrl()}&ci=false&senderTypeCode=ORDER&subscribe=true&epgu_id=${orderId}`;
    return this.http.post<BillsInfoResponse>(path, {}, this.requestOptions);
  }

  /**
   * Получение данных (предначисления) по номеру счета, полная информация
   * @param billId - номер патежа
   * @param orderId - идентификатор заявления
   */
  getBillsInfoByBillId(billId: number, orderId: string): Observable<BillsInfoResponse> {
    // На случай если сервис лежит, только для теста
    // const billMockUp = new BehaviorSubject(mockUpBillsInfo);
    // return billMockUp.asObservable();

    const urlPrefix = this.config.mocks.includes('payment')
      ? `${this.config.mockUrl}/pay/v1/bills`
      : `${this.config.billsApiUrl}bills`;
    // eslint-disable-next-line max-len
    const path = `${urlPrefix}?billIds=${billId}&ci=false`;
    return this.http.post<BillsInfoResponse>(path, {}, this.requestOptions);
  }

  /**
   * Получение статуса платежа по УИН, полная информация
   * @param orderId - идентификатор заявления
   * @param code - идентификатор заявителя
   */
  getPaymentStatusByUIN(orderId: string, code: number = 1): Observable<PaymentInfoForPaidStatusData> {
    const urlPrefix = this.config.mocks.includes('payment')
      ? `${this.config.mockUrl}/lk/v1/paygate/uin`
      : this.config.uinApiUrl;
    const path = `${urlPrefix}/status/${code}?orderId=${orderId}`;
    return this.http.get<PaymentInfoForPaidStatusData>(path, this.requestOptions);
  }

  /**
   * Возвращает адрес куда нужно сделать возврат
   */
  getReturnUrl(): string {
    const slashInEndRex = /\/$/;
    const href = location.href.replace(slashInEndRex,'');
    const haveQuestion = href.includes('?');
    const glueParam = haveQuestion ? '&' : '?';
    const historyParam = 'getLastScreen=1';
    return href.includes(historyParam) ? href : encodeURIComponent(`${href}${glueParam}getLastScreen=1`);
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
   * Загружает информацию из справочников для оплаты
   * @param attrs - аттрибуты
   */
  getDictionaryInfo(attrs: PaymentsAttrs): Observable<PaymentInfoInterface> {
    const { nsi } = attrs;
    const dictionaryOptions = this.createPaymentRequestOptions(attrs);

    return this.dictionaryApiService.getDictionary(nsi, dictionaryOptions).pipe(
      map(({ error: { code }, items }) => {
        if (code === 0) {
          return items[0].attributeValues as PaymentInfoInterface;
        }
        throw Error();
      }),
    );
  }

  /**
   * Возвращает опции для запроса на оплату
   * @param attrs - аттрибуты компонента
   * TODO: В будущем этот метод надо будет удалть, т.к. для совместимости с получением сведения для услуги брака/разбрака
   */
  createPaymentRequestOptions(attrs: PaymentsAttrs): PaymentDictionaryOptionsInterface {
    const { applicantAnswers } = this.screenService;
    const filterReg = JSON.parse(this.getValueFromObjectAsArray(applicantAnswers, attrs?.ref?.fiasCode?.split('.')));

    return getPaymentRequestOptions(filterReg, attrs);
  }

  /**
   * Возращает значение из объекта по массиву переданных ключей
   * @param obj_or_result - объект или значение объекта
   * @param path - массив с путём ключей
   * @private
   */
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
