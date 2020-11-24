import { DictionaryOptions } from '../../../shared/services/dictionary-api/dictionary-api.types';
import { Observable } from 'rxjs';

/**
 * Информация о нужном платеже
 */
export interface PaymentInfoInterface {
  codeOrg: string;
  paymentPurpose: string;
  recipientAccountNumberTOFK: number;
  recipientAccountNumberTaxAuthority: number;
  recipientBankAccountNumber: number;
  recipientBankBIK: string;
  recipientBankName: string;
  recipientBankSWIFT: string;
  recipientINN: string;
  recipientKBK: string;
  recipientKPP: string;
  recipientNameFK: string;
  recipientOKTMO: string;
  recipientPaymentAccount: string;
  recipientTOFK: string;
  recipientTaxAuthorityName: string;
  recipientTitle: string;
  sum: string;
}

/**
 * Интерфейс для статуса опчеченого или нет счета
 */
export interface PaymentInfoForPaidStatus{
  date: string,
  eventWhen: string,
  number: number,
  paid: boolean,
  source: string,
  status: string,
  uin: string
}

/**
 * Интерфейс для данные ответа по ответу на проверку статуса счета
 */
export interface PaymentInfoForPaidStatusData {
  data: PaymentInfoForPaidStatus[],
  total: number
}

/**
 * Интерфейс для части опции запроса на создание оплаты с фильтрацией
 */
export interface PaymentDictionaryOptionsInterface extends DictionaryOptions {
  filter: {
    union: {
      unionKind: string;
      subs: SubPaymentDictionaryOptionInterface[];
    };
  };
}



/**
 * Интерфейс для части опции запроса на создание оплаты
 */
export interface SubPaymentDictionaryOptionInterface {
  simple: {
    attributeName: string;
    condition: string;
    value: {
      asString: string;
    };
  };
}

/**
 * Интерфейс массива информации о суб статусе в одном счете на оплату
 */
export interface BillInfoSubStatusResponse{
  code: string,
  name: string
}

export interface BillInfoBillSumResponse{
  summId: number,
  summ: number
}

export interface BillInfoAddAttrsResponse{
  value: string,
  name: string,
  title: string
}

export interface BillInfoPayRequSitesResponse{
  account: string,
  bankName: string,
  bic: string,
  kbk: string,
  oktmo: string,
  payPurpose: string,
  receiverInn: string,
  receiverKpp: string,
  receiverName: string
}

export interface BillInfoPaidIdResponse{
  id: number,
  amount: number,
  fee: number,
  date: string,
  userId: number
}

/**
 * Интерфейс массива информации в одном счете на оплату
 */
export interface BillInfoResponse{
  billId: number,
  billNumber: string,
  billName: string,
  signature: string,
  billDate: string,
  createDate: string,
  billStatus: BillInfoSubStatusResponse,
  isPaid: boolean,
  amount: number,
  currencyCode: string,
  comment: string,
  service: BillInfoSubStatusResponse,
  billSource: BillInfoSubStatusResponse,
  serviceType: BillInfoSubStatusResponse,
  billSumm: BillInfoBillSumResponse[],
  payRequsites: BillInfoPayRequSitesResponse,
  paidIds: BillInfoPaidIdResponse[],
  addAttrs: BillInfoAddAttrsResponse[],
  selectedByWhiteList: boolean,
  serviceCategory: BillInfoSubStatusResponse,
  isMessage: boolean,
  actualBeforeDate: string
}

/**
 * Интерфейс массива информации о счетах на оплату
 */
export interface BillsInfoResponse{
  error?: {
    code: number,
    message: string
  },
  response: {
    bills: BillInfoResponse[],
    hasEditableSumm: boolean,
    userHasAddress: boolean,
    addressValid: boolean,
    paiedBillIds: number[],
    warning: boolean,
    unidentifiedBillIds: number[],
    fkSmevVersion: number,
    hasUnidentifiedBills: boolean
  }
}

/**
 * Интерфейс филтра опции оплаты
 */
export interface IFilterRegItems{
  value: string
}

/**
 * Интерфейс ошибки оплаты
 */
export interface HttpPaymentError{
  code: number,
  message: string
}
