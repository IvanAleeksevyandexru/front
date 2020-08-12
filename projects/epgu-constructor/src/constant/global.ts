export enum COMPONENT_TYPE {
  'QUESTION' = 'QUESTION',
  'INFO' = 'INFO',
  'COMPONENT' = 'COMPONENT', // внутри этого компонента внутри ровна один компонент
  'CUSTOM' = 'CUSTOM',
  'UNIQUE' = 'UNIQUE',
  'INVITATION_ERROR'= 'INVITATION_ERROR'
}

export enum SCREEN_COMPONENT_NAME {
  'invitationError' = 'InvitationError',
  'confirmPersonalUserRegAddr' = 'ConfirmPersonalUserRegAddr',
  'confirmPersonalUserData' = 'ConfirmPersonalUserData',
  'confirmPersonalUserEmail' = 'ConfirmPersonalUserEmail',
  'confirmPersonalUserPhone' = 'ConfirmPersonalUserPhone',
  'registrationAddr' = 'RegistrationAddr',
  'addPassport' = 'addPassport',
  'snils' = 'StringInput'
}

export enum INFO_SCREEN_COMPONENT {
  'info' = 'InfoSrc',
}

export enum UNIQUE_COMPONENT_NAME {
  'childrenListUnder14' = 'ChildrenListUnder14',
  'addPassport' = 'AddPassport'
}
