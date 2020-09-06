import { DictionaryOptions } from '../../../../services/api/dictionary-api/dictionary-api.types';
import { Display, Gender } from '../../../screen.types';

/**
 * Интерфейс атрибутов приходящих об оплате
 */
export interface PaymentAttrs {
  nsi: string;
  dictItemCode: string;
}

export interface PaymentScenario {
  applicantAnswers: {
    pay1?: {
      value: string;
    }
  };
  currentRule: number;
  currentValue: object;
  currentCycledFields: object;
  cycledFields: Array<object>;
  display: Display;
  errors: object;
  gender: Gender;
  orderId: string;
  sendNotification: Array<object>;
  token: string
  userId: string
}

export interface PaymentInfo {
  codeOrg: string;
  paymentPurpose: string;
  recipientAccountNumberTOFK: any;
  recipientAccountNumberTaxAuthority: any;
  recipientBankAccountNumber: any;
  recipientBankBIK: string;
  recipientBankName: string;
  recipientBankSWIFT: any;
  recipientINN: string;
  recipientKBK: string;
  recipientKPP: string;
  recipientNameFK: any;
  recipientOKTMO: string;
  recipientPaymentAccount: string;
  recipientTOFK: any;
  recipientTaxAuthorityName: any;
  recipientTitle: string;
  sum: string;
}
export interface PaymentDictionaryOptions extends DictionaryOptions {
  filter: {
    union: {
      unionKind: string;
      subs: SubPayment[];
    };
  };
}

/**
 * Интерфейс для части опции запроса на создание оплаты
 */
export interface SubPayment {
  simple: {
    attributeName: string;
    condition: string;
    value: {
      asString: string;
    };
  };
}
