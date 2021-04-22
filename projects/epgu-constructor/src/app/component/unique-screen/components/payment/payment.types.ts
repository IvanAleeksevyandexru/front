/**
 * Информация о нужном платеже
 */
import {
  DictionaryOptions,
  DictionarySimpleFilter,
  DictionarySubFilter,
  DictionaryUnionKind
} from 'epgu-constructor-types/dist/base/dictionary';

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
  DATAN?: string;
  DATAK?: string;
}

/**
 * Интерфейс для статуса опчеченого или нет счета
 */
export interface PaymentInfoForPaidStatus {
  date: string;
  eventWhen: string;
  number: number;
  paid: boolean;
  source: string;
  status: string;
  uin: string;
}

/**
 * Интерфейс для данные ответа по ответу на проверку статуса счета
 */
export interface PaymentInfoForPaidStatusData {
  data: PaymentInfoForPaidStatus[];
  total: number;
}

/**
 * Интерфейс для части опции запроса на создание оплаты с фильтрацией
 */
export interface PaymentDictionaryOptionsInterface extends DictionaryOptions {
  filter: {
    union: {
      unionKind: DictionaryUnionKind;
      subs: SubPaymentDictionaryOptionInterface[];
    };
  };
}

/**
 * Интерфейс для части опции запроса на создание оплаты
 */
export interface SubPaymentDictionaryOptionInterface extends DictionarySubFilter {
  simple: DictionarySimpleFilter;
}

/**
 * Интерфейс массива информации о суб статусе в одном счете на оплату
 */
export interface BillInfoSubStatusResponse {
  code: string;
  name: string;
}

export interface BillInfoBillSumResponse {
  summId: number;
  summ: number;
}

export interface BillInfoAddAttrsResponse {
  value: string;
  name: string;
  title: string;
}

export interface BillInfoPayRequSitesResponse {
  account: string;
  bankName: string;
  bic: string;
  kbk: string;
  oktmo: string;
  payPurpose: string;
  receiverInn: string;
  receiverKpp: string;
  receiverName: string;
}

export interface BillInfoPaidIdResponse {
  id: number;
  amount: number;
  fee: number;
  date: string;
  userId: number;
}

/**
 * Интерфейс массива информации в одном счете на оплату
 */
export interface BillInfoResponse {
  billId: number;
  billNumber: string;
  billName: string;
  signature: string;
  billDate: string;
  createDate: string;
  billStatus: BillInfoSubStatusResponse;
  isPaid: boolean;
  amount: number;
  currencyCode: string;
  comment: string;
  service: BillInfoSubStatusResponse;
  billSource: BillInfoSubStatusResponse;
  serviceType: BillInfoSubStatusResponse;
  billSumm: BillInfoBillSumResponse[];
  payRequsites: BillInfoPayRequSitesResponse;
  paidIds: BillInfoPaidIdResponse[];
  addAttrs: BillInfoAddAttrsResponse[];
  selectedByWhiteList: boolean;
  serviceCategory: BillInfoSubStatusResponse;
  isMessage: boolean;
  actualBeforeDate: string;
}

/**
 * Интерфейс массива информации о счетах на оплату
 */
export interface BillsInfoResponse {
  error?: {
    code: number;
    message: string;
  };
  response: {
    bills: BillInfoResponse[];
    hasEditableSumm: boolean;
    userHasAddress: boolean;
    addressValid: boolean;
    paiedBillIds: number[];
    warning: boolean;
    unidentifiedBillIds: number[];
    fkSmevVersion: number;
    hasUnidentifiedBills: boolean;
  };
}

/**
 * Интерфейс филтра опции оплаты
 */
export interface IFilterRegItems {
  value: string;
}

/**
 * Интерфейс ошибки оплаты
 */
export interface HttpPaymentError {
  code: number;
  message: string;
  status: number;
}

/**
 * Аттрибуты получения сведений для оплаты брака и разбрака
 */
export interface PaymentsAttrs {
  nsi: string;
  dictItemCode: string;
  ref: { fiasCode: string };
}

/**
 * Объект значений со сведений об оплате от бэка
 */
export interface PaymentInfoValue {
  billNumber: string;
  billId: number;
  amount: string;
  billName: string;
  billDate: string;
  payCode: number;
  originalAmount?: string;
}

/**
 * Объект для экпорта в бэк
 */
export interface PaymentInfoEventValue {
  uin: string;
  amount: string;
  amountWithoutDiscount: string;
  paymentPurpose: string;
  receiver: string;
  billId: number;
}
