export enum SCREEN_TYPE {
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
  'personLookup' = 'PersonLookup',
  'docInput' = 'DocInput',
  'addPassport' = 'AddPassport',
  'changeList' = 'ChangeList',
  'snils' = 'StringInput',
  'countryApostil' = 'CountryApostil',
  'childrenListUnder14' = 'ChildrenListUnder14',
  'childrenListAbove14' = 'ChildrenListAbove14',
  'birthCertificate' = 'BirthCertificate',
}

export enum INFO_SCREEN_COMPONENT {
  'info' = 'InfoScr',
}

export enum UNIQUE_COMPONENT_NAME {
  childrenListUnder14 = 'ChildrenListUnder14',
  fileUploadComponent = 'FileUploadComponent',
  'addPassport' = 'AddPassport',
  'mapService' = 'MapService',
}

export const DATE_STRING_DOT_FORMAT = 'DD.MM.YYYY';
export const DATE_STRING_DASH_FORMAT = 'DD-MM-YYYY';

export const FMS_COUNTRIES_DICTIONARY = 'FMS_COUNTRIES';
export const RUSSIA_DICTIONARY_NAME = 'РОССИЯ'

/**
 * Качество фото с камеры в котором будет сохраняться для компонента загрузки файлов
 */
export const imageCameraQuality = 0.9;
