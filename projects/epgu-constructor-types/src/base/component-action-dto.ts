import { ButtonColor } from './color';
import { TargetType } from './target-type';
import { ActionAnswerDto } from './action-answer-dto';
import { Clarifications } from './clarifications';
import { KeyValueMap } from './core.types';
import { System } from './system';
import { CustomComponentRef } from './custom-component-ref';

export interface ComponentActionDto {
  action: DTOActionAction;
  applicantType?: string;
  attrs?: {
    stepsBack?: number;
    screenId?: string;
    hidden?: boolean;
    clarifications?: Clarifications;
    additionalParams?: KeyValueMap;
    showOnOS?: System[];
    needToCloseModal?: boolean;
    ref?: CustomComponentRef[];
  };
  color?: ButtonColor;
  deliriumAction?: string;
  disabled?: boolean;
  disabledByRel?: boolean;
  id?: string;
  hidden?: boolean;
  hint?: string;
  label: string;
  link?: string;
  modalHtml?: string;
  multipleAnswers?: ActionAnswerDto[]; // для умного поиска
  queryParams?: KeyValueMap; // для фильтрации показа списка заявлений
  serviceCode?: string; // для умного поиска
  target?: TargetType; // для умного поиска
  targetCode?: string; // для умного поиска
  type: ActionType;
  underConstruction?: boolean;
  value?: string;
}

export enum ActionType {
  confirmModalStep = 'confirmModalStep',
  copyToClipboard = 'copyToClipboard',
  deleteSuggest = 'deleteSuggest',
  deliriumNextStep = 'deliriumNextStep',
  download = 'download',
  downloadSpAdapterPdf = 'downloadSpAdapterPdf',
  dropdownListModal = 'dropdownListModal',
  externalIntegration = 'externalIntegration',
  getNextQuiz = 'getNextQuiz', // для умного поиска
  home = 'home',
  legalEdit = 'legalEdit',
  modalRedirectTo = 'modalRedirectTo',
  nextStep = 'nextStep',
  nextStepModal = 'nextStepModal',
  orderToOrder = 'orderToOrder',
  prevStep = 'prevStep',
  prevStepModal = 'prevStepModal',
  profileEdit = 'profileEdit',
  quizToOrder = 'quizToOrder',
  redirect = 'redirect', // для умного поиска
  redirectToLK = 'redirectToLK',
  redirectToLKAccount = 'redirectToLKAccount',
  redirectToPayByUin = 'redirectToPayByUin',
  reload = 'reload',
  restartOrder = 'restartOrder',
  skipStep = 'skipStep',
  saveCacheToDraft = 'saveCacheToDraft',
}

export enum DTOActionAction {
  addToCalendar = 'service/action/addToCalendar',
  confirmSmsCode = 'service/actions/confirmSmsCode',
  confirmEmailCode = 'service/actions/confirmEmailCode',
  confirmModalStep = 'confirmModalStep',
  creatUrlAction = 'service/action/createUrl',
  editChildData = 'editChildData',
  editEmail = 'service/actions/editUserEmail',
  editLegalEmail = 'editLegalEmail',
  editLegalPhone = 'editLegalPhone',
  editMedicalData = 'editMedicalData',
  editPassportData = 'editPassportData',
  editPersonalData = 'editPersonalData',
  editPhoneNumber = 'service/actions/editPhoneNumber',
  editUserActualResidence = 'service/actions/editUserAddress/actualResidence',
  editUserPermanentRegistry = 'service/actions/editUserAddress/permanentRegistry',
  editUserPolicy = 'service/actions/editUserPolicy',
  externalIntegrationAction = 'service/actions/externalIntegration',
  restartOrder = 'restartOrder',
  getNextQuiz = 'getNextQuiz', // для умного поиска
  getNextStep = 'getNextScreen',
  getSaveCacheToDraft = 'getSaveCacheToDraft',
  getPrevStep = 'getPrevScreen',
  goBackToMainScenario = 'goBackToMainScenario',
  redirect = 'redirect', // для умного поиска
  redirectToPayByUin = 'redirectToPayByUin',
  reject = 'reject',
  resendEmailConfirmation = 'service/actions/resendEmailConfirmation',
  resendLegalEmailConfirmation = 'service/actions/resendLegalEmailConfirmation',
  serviceEditLegalEmail = 'service/actions/editLegalEmail',
  skipStep = 'skipStep',
  spAdapterPdf = 'sp-adapter/pdf',
}
