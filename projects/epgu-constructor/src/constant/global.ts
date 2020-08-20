export enum COMPONENT_TYPE {
  'QUESTION' = 'QUESTION',
  'INFO' = 'INFO',
  'COMPONENT' = 'COMPONENT', // внутри этого компонента внутри ровна один компонент
  'CUSTOM' = 'CUSTOM',
  'UNIQUE' = 'UNIQUE',
  'INVITATION_ERROR' = 'INVITATION_ERROR',
}

export enum SCREEN_COMPONENT_NAME {
  'invitationError' = 'InvitationError',
  'confirmPersonalUserRegAddr' = 'ConfirmPersonalUserRegAddr',
  'confirmPersonalUserData' = 'ConfirmPersonalUserData',
  'confirmPersonalUserEmail' = 'ConfirmPersonalUserEmail',
  'confirmPersonalUserPhone' = 'ConfirmPersonalUserPhone',
  'registrationAddr' = 'RegistrationAddr',
  'addPassport' = 'addPassport',
  'changeList' = 'ChangeList',
  'snils' = 'StringInput',
  'docInput' = 'DocInput'
}

export enum INFO_SCREEN_COMPONENT {
  'info' = 'InfoScr',
}

export enum UNIQUE_COMPONENT_NAME {
  childrenListUnder14 = 'ChildrenListUnder14',
  addPassport = 'AddPassport',
  fileUploadComponent = 'FileUploadComponent'
}

export enum CONSTANTS {
  'dateFormat' = 'DD.MM.YYYY'
}
