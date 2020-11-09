import { PaymentDictionaryOptionsInterface, SubPaymentDictionaryOptionInterface } from './payment.types';

/**
 * Интерфейс для части опции запроса на создание оплаты
 */
export enum SubPaymentDictionaryOptionType {
  EQUALS = 'EQUALS'
}

/**
 * Тип справочников для услуг
 */
export enum paymentNSIType{
  REGISTER_MARRIAGE = 'fns_zgs_getpay_79272', //Регистрация брака
}

// Статусы оплаты
export enum PaymentStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  SERVER_ERROR = 'serverError',
}

const requestPageSize = 258; //Сколько сведений на одной странице отдавать для запросов

/**
 * Возвращает объект секции фильтра для опций получения информации о платеже
 * @param subs - массив опций фильтра
 * @param unionKind - тип объединения фильтров
 */
const getPaymentRequestOptionsFilter = (subs: SubPaymentDictionaryOptionInterface[], unionKind: string = 'AND') => {
  return {
    pageSize: requestPageSize,
    filter: {
      union: {
        unionKind: unionKind,
        subs: subs
      }
    }
  };
};

/**
 * Возвращает опции запроса для получения информации по платежу для рестрации брака
 * @param filterReg - объект фильтра для оплаты
 * @param attrs - переданные аттрибуты
 * @constructor
 */
const getPaymentRequestOptionsForRegisterBrak = (filterReg: any, attrs: any): any => {
  return {
    ...getPaymentRequestOptionsFilter([
      getPaymentSimpleRequestOption('FiasCode', filterReg.value.substring(0, 3)),
      getPaymentSimpleRequestOption('filter_reg', filterReg.value),
      getPaymentSimpleRequestOption('dictem_code', attrs.dictItemCode),
    ]),
    tx: '41588125-d55f-11ea-8b86-fa163ee4b849'
  };
};

/**
 * Возвращает опции запроса для получения информации по платежу
 * @param filterReg - объект фильтра для оплаты
 * @param attrs - объект с аттрибутами компонента
 * @constructor
 */
// eslint-disable-next-line max-len
export const getPaymentRequestOptions = (filterReg: any, attrs: any): PaymentDictionaryOptionsInterface => {
  return getPaymentRequestOptionsForRegisterBrak(filterReg, attrs);
};


/**
 * Возвращает одну опции атрибута запроса фильтра по платежам
 * @param attributeName - аттрибут для запроса
 * @param value - значение
 * @param condition - тип опции
 */
export const getPaymentSimpleRequestOption = (
  attributeName: string,
  value: string,
  condition: string = SubPaymentDictionaryOptionType.EQUALS
): SubPaymentDictionaryOptionInterface => {
  return {
    simple: {
      attributeName: attributeName,
      condition: condition,
      value: {
        asString: value
      }
    }
  };
};
