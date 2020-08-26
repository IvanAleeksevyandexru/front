import { DictionaryOptionsInterface } from './dictionary-options.interface';

export interface PaymentAttrsInterface {
	nsi: string;
	dictItemCode: string;
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
export interface PaymentDictionaryOptionsInterface extends DictionaryOptionsInterface {
	filter: {
		union: {
			unionKind: string;
			subs: SubInterface[];
		};
	};
}

export interface SubInterface {
	simple: {
		attributeName: string;
		condition: string;
		value: {
			asString: string;
		};
	};
}
