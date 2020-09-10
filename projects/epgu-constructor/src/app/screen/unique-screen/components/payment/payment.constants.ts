import { PaymentDictionaryOptionsInterface, SubPaymentDictionaryInterface } from './payment.types';

// Тестовый id заявки на регистрацию брака
export const mockOrderId = '763430121';

// Тестовый УИН, на случай если сервис лежит
export const mockUpUIN = 'PRIOR0315867900000007308202727';

// Тестовая информация о счете на оплату, если сервис лежит
// eslint-disable-next-line max-len
export const mockUpBillsInfo = {
  response:{
    bills:[
      {
        billId:22209660,
        billNumber:'0316373317011700000057047',
        billName:'Госпошлина ЗАГС',
        signature:'La9aAQra2OdpQMDyJHhg2A',
        billDate:'2019-04-29T12:44:47.000+0300',
        createDate:'2020-09-07T12:00:17.000+0300',
        billStatus:{ code:'NEW',name:'Новый' },
        isPaid:false,
        amount:359,
        currencyCode:'643',
        comment:'Госпошлина ЗАГС',
        service:{ code:'GIBDD_1',name:'Оплата штрафа за нарушение ПДД' },
        billSource:{ code:'FK',name:'ГИС ГМП' },
        serviceType:{ code:'000000',name:'Государственные услуги' },
        billSumm:[{ summId:25740082,summ:359 }],
        payRequsites:{
          account:'40101810900000010007',
          bankName:'ГРКЦ ГУ Банка России по Томской области г.Томск',
          bic:'046902001',
          kbk:'18811107141011000110',
          oktmo:'69632000',
          payPurpose:'Госпошлина ЗАГС',
          receiverInn:'7018016237',
          receiverKpp:'701701001',
          receiverName:'УФК по Томской области'
        },paidIds:[],
        addAttrs:[
          { value:'01',name:'FKStatus',title:'FKStatus' },
          { value:'0',name:'FKPurpose',title:'FKPurpose' },
          { value:'0',name:'FKTaxDocDate',title:'FKTaxDocDate' },
          { value:'FMS',name:'billType',title:'Find by' },
          { value:'г. Томск, ЗАГС №18',name:'ReceiverPdfName',title:'ReceiverPdfName' },
          { value:'512.00',name:'BillTotalAmount',title:'BillTotalAmount' },
          { value:'г. Томск, ЗАГС №18',name:'SupplierFullName',title:'SupplierFullName' },
          { value:'0',name:'FKPaymentType',title:'FKPaymentType' },
          { value:'0',name:'FKTaxDocNumber',title:'FKTaxDocNumber' },
          { value:'УФК по Томской области',name:'TreasureBranch',title:'TreasureBranch' },
          { value:'512',name:'OriginalAmount',title:'OriginalAmount' },
          { value:'0',name:'FKTaxPeriod',title:'FKTaxPeriod' },
          { value:'30',name:'MultiplierSize',title:'MultiplierSize' },
          { value:'11801265',name:'billRequestId',title:'billRequestId' },
          { value:'1400000000000069600068643',name:'AltPayerIdentifier',title:'AltPayerIdentifier' },
          { value:'00069600068',name:'number_doc',title:'number_doc' },
          { value:'CНИЛС',name:'type_doc',title:'type_doc' },
          { value:'763430121',name:'epgu_order_id',title:'epgu_order_id' },
          { value:'2',name:'FKQuittanceStatus',title:'FKQuittanceStatus' },
          { value:'Недоплата 512,00 руб',name:'FKQuittanceComment',title:'FKQuittanceComment' },
          { value:'true',name:'isPaidNoAddress',title:'isPaidNoAddress' }],
        selectedByWhiteList:false,
        serviceCategory:{ code:'FINE',name:'Штраф' },
        isMessage:false,
        appealAvailable:true,
        refundAvailable:false,
        hasPhoto:false
      }],
    hasEditableSumm:false,
    userHasAddress:true,
    addressValid:true,
    paiedBillIds:[],
    warning:true,
    unidentifiedBillIds:[],
    fkSmevVersion:2,
    hasUnidentifiedBills:false
  },
  error:{
    code:0
  }
};

// Статусы оплаты
export enum PaymentStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  SERVER_ERROR = 'serverError',
}

/**
 * Возвращает опции запроса для получения информации по платежу
 * @param filterReg - объект фильтра для оплаты
 * @param dictItemCode - код элемента справочника на оплату
 * @constructor
 */
export const getPaymentRequestOptions = (filterReg, dictItemCode): PaymentDictionaryOptionsInterface => {
  return {
    pageSize: '258',
    filter: {
      union: {
        unionKind: 'AND',
        subs: [
          getPaymentRequestOptionFiasCode(filterReg),
          getPaymentRequestOptionFilterReg(filterReg),
          getPaymentRequestOptionDictemCode(filterReg, dictItemCode),
        ],
      },
    },
    tx: '41588125-d55f-11ea-8b86-fa163ee4b849',
  };
};

/**
 * Возвращает опции атрибута запроса FiasCode
 * @param filterReg - объект фильтра для оплаты
 */
export const getPaymentRequestOptionFiasCode = (filterReg): SubPaymentDictionaryInterface => {
  return {
    simple: {
      attributeName: 'FiasCode',
      condition: 'EQUALS',
      value: {
        asString: filterReg.value.substring(0, 3)
      }
    }
  };
};

/**
 * Возвращает опции атрибута запроса filter_reg
 * @param filterReg - объект фильтра для оплаты
 */
export const getPaymentRequestOptionFilterReg = (filterReg): SubPaymentDictionaryInterface => {
  return {
    simple: {
      attributeName: 'filter_reg',
      condition: 'EQUALS',
      value: {
        asString: filterReg.value
      }
    }
  };
};

/**
 * Возвращает опции атрибута запроса dictem_code
 * @param filterReg - объект фильтра для оплаты
 * @param dictItemCode - код элемента справочника на оплату
 */
export const getPaymentRequestOptionDictemCode = (filterReg, dictItemCode): SubPaymentDictionaryInterface => {
  return {
    simple: {
      attributeName: 'dictem_code',
      condition: 'EQUALS',
      value: {
        asString: dictItemCode
      }
    }
  };
};
