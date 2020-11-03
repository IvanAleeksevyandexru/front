import { PaymentDictionaryOptionsInterface, SubPaymentDictionaryOptionInterface } from './payment.types';
import { ConfigService } from '../../../../core/config/config.service';

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
  REGISTER_VEHICLE = 'MVD_equeue_70732', //Регистрация транспортного средства
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
        unionKind: 'AND',
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
 * Возвращает опции запроса для получения информации по платежу для рестрации транспортного средства
 * @param filterReg - объект фильтра для оплаты
 * @param attrs - объект с аттрибутами компонента
 * @param gibddRouteNumber - переданные аттрибуты
 * @constructor
 */
const getPaymentRequestOptionsForRegisterTS = (filterReg: any, attrs: any, gibddRouteNumber: string): any => {
  return {
    ...getPaymentRequestOptionsFilter([
      getPaymentSimpleRequestOption('region', gibddRouteNumber),
      //getPaymentSimpleRequestOption('code', filterReg?.attributeValues?.code),
      //TODO: HARDCODE пока неизвестно с номером справочника
      getPaymentSimpleRequestOption('code', '10000593393'),
    ]),
    treeFiltering: 'ONELEVEL',
    pageSize: 10000,
    parentRefItemValue: '',
    selectAttributes: ['*'],
    tx: ''
  };
};

/**
 * Возвращает опции запроса для получения информации по платежу
 * @param filterReg - объект фильтра для оплаты
 * @param attrs - объект с аттрибутами компонента
 * @param config - конфиг приложения
 * @constructor
 */
// eslint-disable-next-line max-len
export const getPaymentRequestOptions = (filterReg: any, attrs: any, config: ConfigService): PaymentDictionaryOptionsInterface => {
  const { nsi } = attrs;

  switch (nsi){
    case paymentNSIType.REGISTER_VEHICLE:
      return getPaymentRequestOptionsForRegisterTS(filterReg, attrs, config.gibddRouteNumber);
      break;
    case paymentNSIType.REGISTER_MARRIAGE:
    default:
      return getPaymentRequestOptionsForRegisterBrak(filterReg, attrs);
      break;
  }
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
