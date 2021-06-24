import { PaymentTypes, ProgramType } from './payment-way.types';

export const paymentsLabel: Record<keyof typeof PaymentTypes, string> = {
  [PaymentTypes.pfdod_certificate]: 'Сертификатом',
  [PaymentTypes.paid]: 'Из личных средств',
  [PaymentTypes.private]: 'Из личных средств',
  [PaymentTypes.none]: 'Бесплатно',
  [PaymentTypes.budget]: 'Бесплатно',
};

export const programsLabel: Record<keyof typeof ProgramType, string> = {
  [ProgramType.other]: 'Иная образовательная',
  [ProgramType.preprof]: 'Предпрофессиональная',
  [ProgramType.valued]: 'Значимая',
};
