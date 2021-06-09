import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  BillsInfoResponse,
  PaymentDictionaryOptionsInterface,
  PaymentInfoForPaidStatusData,
  PaymentInfoInterface,
  PaymentsAttrs,
} from './payment.types';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { ScreenService } from '../../../../screen/screen.service';
import { DictionaryConditions, DictionaryUnionKind } from '@epgu/epgu-constructor-types';

const billsInfo = {
  error: {
    code: 0,
    message: '',
  },
  response: {
    bills: [
      {
        billId: 0,
        billNumber: '',
        billName: '',
        signature: '',
        billDate: '',
        createDate: '',
        billStatus: {
          code: '',
          name: '',
        },
        isPaid: false,
        amount: 3244,
        currencyCode: '',
        comment: '',
        service: {
          code: '',
          name: '',
        },
        billSource: {
          code: '',
          name: '',
        },
        serviceType: {
          code: '',
          name: '',
        },
        billSumm: [],
        payRequsites: {
          account: '',
          bankName: '',
          bic: '',
          kbk: '',
          oktmo: '',
          payPurpose: '',
          receiverInn: '',
          receiverKpp: '',
          receiverName: '',
        },
        paidIds: [],
        addAttrs: [],
        selectedByWhiteList: false,
        serviceCategory: {
          code: '',
          name: '',
        },
        isMessage: false,
        actualBeforeDate: '',
      },
    ],
    hasEditableSumm: false,
    userHasAddress: true,
    addressValid: true,
    paiedBillIds: [],
    warning: false,
    unidentifiedBillIds: [],
    fkSmevVersion: 0,
    hasUnidentifiedBills: false,
  },
};

/**
 * Сервис для оплаты услуг пользователем (Заглушка)
 */
@Injectable()
export class PaymentServiceStub {
  public requestOptions = { withCredentials: true };

  constructor(
    public config: ConfigService,
    public dictionaryApiService: DictionaryApiService,
    public screenService: ScreenService,
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
  getUinByOrderId(
    orderId: number,
    code: number = 1,
    attributeValues: PaymentInfoInterface,
  ): Observable<{ value: string }> {
    return of({ value: 'PRIOR234324234234234' });
  }

  /**
   * Получение данных (предначисления) по УИН, полная информация
   * @param uin - уникальный идентификатор патежа
   * @param orderId - идентификатор заявления
   */
  getBillsInfoByUIN(uin: string | number, orderId: number): Observable<BillsInfoResponse> {
    return of(billsInfo);
  }

  /**
   * Получение данных (предначисления) по номеру счета, полная информация
   * @param billId - номер патежа
   * @param orderId - идентификатор заявления
   */
  getBillsInfoByBillId(billId: number, orderId: number): Observable<BillsInfoResponse> {
    return of(billsInfo);
  }

  /**
   * Получение статуса платежа по УИН, полная информация
   * @param orderId - идентификатор заявления
   * @param code - идентификатор заявителя
   */
  getPaymentStatusByUIN(
    orderId: number,
    code: number = 1,
  ): Observable<PaymentInfoForPaidStatusData> {
    return of({
      data: [
        {
          date: '',
          eventWhen: '',
          number: 0,
          paid: false,
          source: '',
          status: '',
          uin: '',
        },
      ],
      total: 1000,
    });
  }

  /**
   * Возвращает адрес куда нужно сделать возврат
   */
  getReturnUrl(): string {
    return '';
  }

  /**
   * Возвращает ссылку на оплату для перехода пользователя
   *
   * @param billId - уникальный идентификатор патежа
   */
  getPaymentLink(billId: number): string {
    return '';
  }

  /**
   * Загружает информацию из справочников для оплаты
   * @param attrs - аттрибуты
   */
  getDictionaryInfo(attrs: PaymentsAttrs): Observable<PaymentInfoInterface> {
    return of({
      codeOrg: '',
      paymentPurpose: '',
      recipientAccountNumberTOFK: 0,
      recipientAccountNumberTaxAuthority: 0,
      recipientBankAccountNumber: 0,
      recipientBankBIK: '',
      recipientBankName: '',
      recipientBankSWIFT: '',
      recipientINN: '',
      recipientKBK: '',
      recipientKPP: '',
      recipientNameFK: '',
      recipientOKTMO: '',
      recipientPaymentAccount: '',
      recipientTOFK: '',
      recipientTaxAuthorityName: '',
      recipientTitle: '',
      sum: '4564',
    });
  }

  /**
   * Возвращает опции для запроса на оплату
   * @param attrs - аттрибуты компонента
   * TODO: В будущем этот метод надо будет удалть, т.к. для совместимости с получением сведения для услуги брака/разбрака
   */
  createPaymentRequestOptions(attrs: PaymentsAttrs): PaymentDictionaryOptionsInterface {
    return {
      filter: {
        union: {
          unionKind: DictionaryUnionKind.AND,
          subs: [
            {
              simple: {
                attributeName: '',
                condition: DictionaryConditions.EQUALS,
                value: {
                  asString: '',
                },
              },
            },
          ],
        },
      },
    };
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
    return '';
  }
}
