import { DictionaryOptions } from '../app/services/api/dictionary-api/dictionary-api.types';
import { Display, Gender } from '../app/services/api/form-player-api/form-player-api.types';

/**
 * Интерфейс атрибутов приходящих об оплате
 */
export interface PaymentAttrsInterface {
  nsi: string;
  dictItemCode: string;
}

export interface PaymentScenarioInterface {
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

export interface PaymentInfoInterface {
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
export interface PaymentDictionaryOptionsInterface extends DictionaryOptions {
  filter: {
    union: {
      unionKind: string;
      subs: SubInterface[];
    };
  };
}

/**
 * Интерфейс для части опции запроса на создание оплаты
 */
export interface SubInterface {
  simple: {
    attributeName: string;
    condition: string;
    value: {
      asString: string;
    };
  };
}
