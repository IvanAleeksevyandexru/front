export enum EaisdoStateTypes {
  wait = 'wait',
  errorExhaustedСertificate = 'errorExhaustedСertificate',
  errorExhaustedProgram = 'errorExhaustedProgram',
  errorBad = 'errorBad',
  errorTimeOut = 'errorTimeOut',
  errorIneffectual = 'errorIneffectual',
  free = 'free',
  other = 'other',
  preprof = 'preprof',
  valued = 'valued',
  paid = 'paid',
  certificate = 'certificate',
}

export enum EaisdoResponseTypes {
  groupCostCalculationResponse = 'GroupCostCalculationResponse',
  groupCostIneffectualResponse = 'GroupCostIneffectualResponse',
  groupCostFreeOfChargeResponse = 'GroupCostFreeOfChargeResponse',
  groupCostCertificateExhaustedResponse = 'GroupCostCertificateExhaustedResponse',
  groupCostBadCalculationDataResponse = 'GroupCostBadCalculationDataResponse',
}

export enum EaisdoFinancialSourceTypes {
  none = 'none',
  paid = 'paid',
  private = 'private',
  budget = 'budget',
  pfdod_certificate = 'pfdod_certificate',
}

export enum EaisdoTypeOfBudgetTypes {
  free = 'free',
  preprof = 'preprof',
  valued = 'valued',
  other = 'other',
}
