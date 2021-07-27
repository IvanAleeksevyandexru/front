import { ButtonColor } from './color';
import { TargetType } from './target-type';
import { ActionAnswerDto } from './action-answer-dto';

export interface ComponentActionDto {
  action: DTOActionAction;
  applicantType?: string;
  attrs?: {
    stepsBack?: number;
  };
  color?: ButtonColor;
  deliriumAction?: string;
  disabled?: boolean;
  id?: string;
  hidden?: boolean;
  hint?: string;
  label: string;
  link?: string;
  modalHtml?: string;
  multipleAnswers?: ActionAnswerDto[]; // для умного поиска
  serviceCode?: string; // для умного поиска
  target?: TargetType; // для умного поиска
  targetCode?: string; // для умного поиска
  type?: ActionType;
  underConstruction?: boolean;
  value?: string;
}

export enum ActionType {
  attachUploadedFiles = 'attachUploadedFiles',
  confirmModalStep = 'confirmModalStep',
  deleteSuggest = 'deleteSuggest',
  deliriumNextStep = 'deliriumNextStep',
  download = 'download',
  externalIntegration = 'externalIntegration',
  dropdownListModal = 'dropdownListModal',
  getNextQuiz = 'getNextQuiz', // для умного поиска
  home = 'home',
  modalRedirectTo = 'modalRedirectTo',
  nextStep = 'nextStep',
  nextStepModal = 'nextStepModal',
  orderToOrder = 'orderToOrder',
  prevStep = 'prevStep',
  prevStepModal = 'prevStepModal',
  profileEdit = 'profileEdit',
  legalEdit = 'legalEdit',
  quizToOrder = 'quizToOrder',
  redirect = 'redirect', // для умного поиска
  redirectToLK = 'redirectToLK',
  redirectToPayByUin = 'redirectToPayByUin',
  skipStep = 'skipStep',
}

export enum DTOActionAction {
  attachUploadedFiles = 'attachUploadedFiles',
  confirmSmsCode = 'service/actions/confirmSmsCode',
  confirmEmailCode = 'service/actions/confirmEmailCode',
  editChildData = 'editChildData',
  editEmail = 'service/actions/editUserEmail',
  editLegalEmail = 'editLegalEmail',
  editLegalPhone = 'editLegalPhone',
  editMedicalData = 'editMedicalData',
  editPassportData = 'editPassportData',
  editPhoneNumber = 'service/actions/editPhoneNumber',
  editUserActualResidence = 'service/actions/editUserAddress/actualResidence',
  editUserPermanentRegistry = 'service/actions/editUserAddress/permanentRegistry',
  externalIntegrationAction = 'service/actions/externalIntegration',
  getNextQuiz = 'getNextQuiz', // для умного поиска
  getNextStep = 'getNextScreen',
  getPrevStep = 'getPrevScreen',
  goBackToMainScenario = 'goBackToMainScenario',
  redirect = 'redirect', // для умного поиска
  redirectToPayByUin = 'redirectToPayByUin',
  reject = 'reject',
  resendEmailConfirmation = 'service/actions/resendEmailConfirmation',
  resendLegalEmailConfirmation = 'service/actions/resendLegalEmailConfirmation',
  serviceEditLegalEmail = 'service/actions/editLegalEmail',
  skipStep = 'skipStep',
}
