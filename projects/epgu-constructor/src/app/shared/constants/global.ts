export enum SCREEN_TYPE {
  'QUESTION' = 'QUESTION',
  'INFO' = 'INFO',
  'COMPONENT' = 'COMPONENT', // внутри этого компонента внутри ровна один компонент
  'CUSTOM' = 'CUSTOM',
  'UNIQUE' = 'UNIQUE',
  'INVITATION_ERROR' = 'INVITATION_ERROR',
  'EMPTY' = 'EMPTY'
}

export enum SCREEN_COMPONENT_NAME {
  'invitationError' = 'InvitationError',
  'confirmPersonalUserRegAddr' = 'ConfirmPersonalUserRegAddr',
  'confirmPersonalUserData' = 'ConfirmPersonalUserData',
  'confirmPersonalUserEmail' = 'ConfirmPersonalUserEmail',
  'confirmPersonalUserPhone' = 'ConfirmPersonalUserPhone',
  'registrationAddr' = 'RegistrationAddr',
  'personLookup' = 'PersonLookup',
  'addPassport' = 'AddPassport',
  'changeList' = 'ChangeList',
  'childrenListUnder14' = 'ChildrenListUnder14',
  'childrenListAbove14' = 'ChildrenListAbove14',
  'snilsInput' = 'SnilsInput',
  'docInput' = 'DocInput',
  'countryApostil' = 'CountryApostil',
  'paymentScr' = 'PaymentScr'
}

export enum INFO_SCREEN_COMPONENT {
  'info' = 'InfoScr',
}
