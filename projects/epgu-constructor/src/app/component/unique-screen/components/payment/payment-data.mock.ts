export const billsInfoMock = {
  error: {
    code: 0,
    message: '',
  },
  response: {
    bills: [
      {
        billId: 0,
        billNumber: '',
        billName: '',
        signature: '',
        billDate: '',
        createDate: '',
        billStatus: {
          code: '',
          name: '',
        },
        isPaid: false,
        amount: 3244,
        currencyCode: '',
        comment: '',
        service: {
          code: '',
          name: '',
        },
        billSource: {
          code: '',
          name: '',
        },
        serviceType: {
          code: '',
          name: '',
        },
        billSumm: [],
        payRequsites: {
          account: '',
          bankName: '',
          bic: '',
          kbk: '',
          oktmo: '',
          payPurpose: '',
          receiverInn: '',
          receiverKpp: '',
          receiverName: '',
        },
        paidIds: [],
        addAttrs: [],
        selectedByWhiteList: false,
        serviceCategory: {
          code: '',
          name: '',
        },
        isMessage: false,
        actualBeforeDate: '',
      },
    ],
    hasEditableSumm: false,
    userHasAddress: true,
    addressValid: true,
    paiedBillIds: [],
    warning: false,
    unidentifiedBillIds: [],
    fkSmevVersion: 0,
    hasUnidentifiedBills: false,
  },
};

export const paymentInfoForPaidStatusDataMock = {
  data: [
    {
      date: '',
      eventWhen: '',
      number: 0,
      paid: false,
      source: '',
      status: '',
      uin: '',
    },
  ],
  total: 1000,
};

export const paymentInfoMock = {
  codeOrg: '',
  paymentPurpose: '',
  recipientAccountNumberTOFK: 0,
  recipientAccountNumberTaxAuthority: 0,
  recipientBankAccountNumber: 0,
  recipientBankBIK: '',
  recipientBankName: '',
  recipientBankSWIFT: '',
  recipientINN: '',
  recipientKBK: '',
  recipientKPP: '',
  recipientNameFK: '',
  recipientOKTMO: '',
  recipientPaymentAccount: '',
  recipientTOFK: '',
  recipientTaxAuthorityName: '',
  recipientTitle: '',
  sum: '4564',
}
