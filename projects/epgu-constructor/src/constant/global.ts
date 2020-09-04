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

export enum UNIQUE_COMPONENT_NAME {
  fileUploadComponent = 'FileUploadComponent',
  'addPassport' = 'AddPassport',
  'timeSlot' = 'TimeSlot',
  'mapService' = 'MapService',
  'carInfo' = 'CarInfo',
  'repeatableFields' = 'RepeatableFields',
  'employeeHistory' = 'EmployeeHistory',
}

export enum EMPTY_SCREEN_COMPONENT {
  'redirect' = 'Redirect',
}

export enum CUSTOM_COMPONENT_ITEM_TYPE {
  LabelSection = 'LabelSection',
  Dictionary = 'Dictionary',
  DropDown = 'DropDown',
  StringInput = 'StringInput',
  DateInput = 'DateInput',
  RadioInput = 'RadioInput',
  CompositeRadioButton = 'CompositeRadioButton',
  Lookup = 'Lookup',
}

export const DATE_STRING_DOT_FORMAT = 'DD.MM.YYYY';
export const DATE_STRING_DASH_FORMAT = 'DD-MM-YYYY';

export const FMS_COUNTRIES_DICTIONARY = 'FMS_COUNTRIES';
export const RUSSIA_DICTIONARY_NAME = 'РОССИЯ';

/**
 * Качество фото с камеры в котором будет сохраняться для компонента загрузки файлов
 */
export const imageCameraQuality = 0.9;
