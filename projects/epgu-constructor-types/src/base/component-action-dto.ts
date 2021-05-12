import { ButtonColor } from './color';
import { TargetType } from './target-type';
import { ActionAnswerDto } from './action-answer-dto';

export interface ComponentActionDto {
  label: string;
  action: DTOActionAction;
  value?: string;
  type?: ActionType;
  hidden?: boolean;
  disabled?: boolean;
  applicantType?: string;
  color?: ButtonColor;
  link?: string;
  underConstruction?: boolean;
  hint?: string;
  attrs?: {
    stepsBack?: number;
  };
  deliriumAction?: string;
  target?: TargetType; // для умного поиска
  serviceCode?: string; // для умного поиска
  targetCode?: string; // для умного поиска
  multipleAnswers?: ActionAnswerDto[]; // для умного поиска
}

export enum ActionType {
  download = 'download',
  prevStepModal = 'prevStepModal',
  nextStepModal = 'nextStepModal',
  confirmModalStep = 'confirmModalStep',
  modalRedirectTo = 'modalRedirectTo',
  prevStep = 'prevStep',
  nextStep = 'nextStep',
  skipStep = 'skipStep',
  redirectToLK = 'redirectToLK',
  quizToOrder = 'quizToOrder',
  profileEdit = 'profileEdit',
  home = 'home',
  deleteSuggest = 'deleteSuggest',
  attachUploadedFiles = 'attachUploadedFiles',
  dropdownListModal = 'dropdownListModal',
  deliriumNextStep = 'deliriumNextStep',
  getNextQuiz = 'getNextQuiz', // для умного поиска
  redirect = 'redirect', // для умного поиска
  redirectToPayByUin = 'redirectToPayByUin',
}

export enum DTOActionAction {
  getNextStep = 'getNextScreen',
  getPrevStep = 'getPrevScreen',
  skipStep = 'skipStep',
  reject = 'reject',
  editPhoneNumber = 'service/actions/editPhoneNumber',
  confirmSmsCode = 'service/actions/confirmSmsCode',
  editEmail = 'service/actions/editUserEmail',
  editUserPermanentRegistry = 'service/actions/editUserAddress/permanentRegistry',
  editUserActualResidence = 'service/actions/editUserAddress/actualResidence',
  goBackToMainScenario = 'goBackToMainScenario',
  resendEmailConfirmation = 'service/actions/resendEmailConfirmation',
  resendLegalEmailConfirmation = 'service/actions/resendLegalEmailConfirmation',
  editPassportData = 'editPassportData',
  editLegalPhone = 'editLegalPhone',
  editLegalEmail = 'editLegalEmail',
  serviceEditLegalEmail = 'service/actions/editLegalEmail',
  attachUploadedFiles = 'attachUploadedFiles',
  redirect = 'redirect', // для умного поиска
  getNextQuiz = 'getNextQuiz', // для умного поиска
  redirectToPayByUin = 'redirectToPayByUin',
}
