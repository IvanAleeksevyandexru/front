import { PaymentTypes } from './payment-way.types';

export const paymentWaysLabel: Record<keyof typeof PaymentTypes, string> = {
  [PaymentTypes.certificate]: 'Сертификатом',
  [PaymentTypes.purse]: 'Из личных средств',
  [PaymentTypes.free]: 'Бесплатно'
};
