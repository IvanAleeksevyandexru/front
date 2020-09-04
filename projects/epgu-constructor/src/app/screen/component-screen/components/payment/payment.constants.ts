import { PaymentDictionaryOptionsInterface, SubInterface } from '../../../../../interfaces/payment.interface';

// Тестовый id заявки на регистрацию брака
export const mockOrderId = '763430121';

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
export const getPaymentRequestOptionFiasCode = (filterReg): SubInterface => {
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
export const getPaymentRequestOptionFilterReg = (filterReg): SubInterface => {
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
export const getPaymentRequestOptionDictemCode = (filterReg, dictItemCode): SubInterface => {
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
