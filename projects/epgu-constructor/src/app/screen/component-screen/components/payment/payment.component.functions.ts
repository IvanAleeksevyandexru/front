import {
  BillInfoAddAttrsResponse,
  BillInfoResponse,
  BillsInfoResponse
} from '../../../../../interfaces/payment.interface';
import * as moment from 'moment';
import { DATE_STRING_DOT_FORMAT } from '../../../../../constant/global';

/**
 * Возвращает значение аттрибута объекта счета или null
 * @param bill - сведения о счете
 * @param attrName - ключ аттрибута, который надо найти
 * @private
 */
export const getBillAttributeValueByKey = (bill: BillInfoResponse, attrName: string): string | null => {
  const attrIndex = bill.addAttrs.findIndex((attrInfo: BillInfoAddAttrsResponse) => {
    return attrInfo.name === attrName;
  });
  return bill.addAttrs[attrIndex]?.value;
};

/**
 * Возвращает дату действия скидки
 * @param bill - счёт на оплату
 * @private
 */
export const getDiscountDate = (bill: BillInfoResponse): string => {
  const discountDate =
    getBillAttributeValueByKey(bill, 'DiscountDate') || bill.actualBeforeDate;
  return discountDate ? moment(discountDate).format(DATE_STRING_DOT_FORMAT) : '';
};

/**
 * Возвращает цену без скидки, для зачеркнутой цены
 * @param bill - счёт на оплату
 * @private
 */
export const getDiscountPrice = (bill: BillInfoResponse): string => {
  return (
    getBillAttributeValueByKey(bill, 'OriginalAmount') ||
    getBillAttributeValueByKey(bill, 'DiscountSize') ||
    ''
  );
};

/**
 * Возвращает информацию по начислению
 * @param bill
 * @private
 */
export const getDocInfo = (bill: BillInfoResponse): string => {
  return [
    getBillAttributeValueByKey(bill, 'type_doc'),
    getBillAttributeValueByKey(bill, 'number_doc'),
  ].join(' ');
};

/**
 * Фильтруем данные по нашему счёту
 * @param answer - ответ сервера
 * @private
 */
export const filterBillInfoResponse = (answer: any): BillsInfoResponse => {
  return answer?.response || answer;
};
