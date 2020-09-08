import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { getPaymentRequestOptions, mockUpUIN } from './payment.constants';
import { FormPlayerService } from '../../../../services/form-player/form-player.service';
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
  private apiUrl: string;
  private externalUrl: string;
  private paymentUrl: string;
  screenStore: ScreenStore;

  constructor(
    private http: HttpClient,
    private dictionaryApiService: DictionaryApiService,
    private configService: ConfigService,
    public formPlayerService: FormPlayerService,
    private screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService
  ) {
    this.apiUrl = this.configService.config.apiUrl;
    this.externalUrl = this.configService.config.externalUrl;
    this.paymentUrl = this.configService.config.paymentUrl;

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
   * Возвращает путь API адреса для обращений к сервису TERABYTE
   *
   * @param relativePath - относительный путь от API для запросов
   */
  private getPayInfoApiUrl = (relativePath): string => this.externalUrl + relativePath;

  /**
   * Загружает данные по оплате с реквизитами
   * @param orderId - идентификатор заявления
   * @param nsi - наименование справочника с информацией
   * @param dictItemCode - код нужного справочника
   */
  loadPaymentInfo(orderId, nsi, dictItemCode): Observable<any> {
    const dictionaryOptions = this.createPaymentRequestOptions(dictItemCode);

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
  getUinByOrderId(orderId: string, code: number = 1, attributeValues: PaymentInfoInterface): Observable<any> {
    // TODO: Специальная подмена на оплату 1,4 рубля гос пошлины, иначе будет как есть снятие
    if (location.hostname === 'local.test.gosuslugi.ru') {
      const uinMockUp = new BehaviorSubject({
        value: mockUpUIN
      });
      return uinMockUp.asObservable();
    }

    const path = `api/lk/v1/paygate/uin/${code}?orderId=${orderId}`;
    return this.http.post(
      this.getPayInfoApiUrl(path),
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
    // На случай если сервис лежит, только для теста
    // const billMockUp = new BehaviorSubject(mockUpBillsInfo);
    // return billMockUp.asObservable();

    const path = `api/pay/v1/bills?billNumber=${uin}&ci=false&senderTypeCode=ORDER&subscribe=true&epgu_id=${orderId}`;
    return this.http.post(
      this.getPayInfoApiUrl(path), {},
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
    const path = `api/lk/v1/paygate/uin/status/${code}?orderId=${orderId}`;
    return this.http.get(
      this.getPayInfoApiUrl(path),
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
   * @param billId - уникальный идентификатор патежа
   */
  getPaymentLink(billId: number): string {
    // TODO хардкод. доделать.
    // eslint-disable-next-line prettier/prettier
    return `${this.paymentUrl}/?billIds=${billId}&returnUrl=${encodeURIComponent(this.apiUrl)}&subscribe=true`;
  }

  /**
   * Возвращает опции для запроса на оплату
   * @param dictItemCode - код элемента справочника на оплату
   */
  createPaymentRequestOptions(dictItemCode: string): PaymentDictionaryOptionsInterface {
    const { applicantAnswers } = this.screenStore;
    // eslint-disable-next-line prettier/prettier
    const filterReg = JSON.parse(applicantAnswers.ms1.value);

    // TODO хардкод. доделать.
    return getPaymentRequestOptions(filterReg, dictItemCode);
  }
}
