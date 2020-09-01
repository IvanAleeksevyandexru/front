// Тестовый id заявки на регистрацию брака
import { PaymentDictionaryOptionsInterface } from '../../../../../interfaces/payment.interface';

export const mockOrderId = '763419899';

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
          {
            simple: {
              attributeName: 'FiasCode',
              condition: 'EQUALS',
              value: { asString: filterReg.value.substring(0, 3) },
            },
          },
          {
            simple: {
              attributeName: 'filter_reg',
              condition: 'EQUALS',
              value: { asString: filterReg.value },
            },
          },
          {
            simple: {
              attributeName: 'dictem_code',
              condition: 'EQUALS',
              value: {
                asString: dictItemCode
              },
            },
          },
        ],
      },
    },
    tx: '41588125-d55f-11ea-8b86-fa163ee4b849',
  };
};
