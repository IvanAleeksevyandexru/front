import { of, Observable } from 'rxjs';
import {
  ComponentDto,
  ComponentActionDto,
  DTOActionAction,
  ActionType,
  ActionApiResponse,
} from '../../../../../../epgu-constructor-types/src';

export const mockComponent: ComponentDto = {
  attrs: {},
  label: '',
  type: '',
  id: '12',
  value: '',
};

export const sendActionMock = of({
  errorList: [],
  responseData: { value: 'value', type: 'type' },
}) as Observable<ActionApiResponse<string>>;

export const deliriumAction: ComponentActionDto = {
  label: 'delirium',
  value: 'delirium',
  action: DTOActionAction.getNextStep,
  type: ActionType.deliriumNextStep,
  deliriumAction: 'edit',
};
export const downloadAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.download,
};

export const prevStepModalAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.prevStepModal,
};

export const nextStepModalAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.nextStepModal,
};

export const skipAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.skipStep,
};

export const restartOrderAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.restartOrder,
  type: ActionType.restartOrder,
};

export const nextAction: ComponentActionDto = {
  label: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.nextStep,
  value: 'some value',
};

export const prevAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.prevStep,
  attrs: { stepsBack: 1 },
};

export const saveCacheAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.getSaveCacheToDraft,
  type: ActionType.saveCacheToDraft,
};

export const quizToOrderAction: ComponentActionDto = {
  label: '',
  value: '',
  action: '/to-some-order' as DTOActionAction,
  type: ActionType.quizToOrder,
};

export const orderToOrderAction: ComponentActionDto = {
  label: '',
  value: '',
  action: '/to-some-order' as DTOActionAction,
  type: ActionType.orderToOrder,
  multipleAnswers: [
    {
      screenId: 's1',
      componentId: 'w1',
      priority: 2,
      value: 'valueA',
    },
    {
      screenId: 's2',
      componentId: 'q1',
      priority: 1,
      value: 'valueB',
    },
  ],
};

export const redirectToLKAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.redirectToLK,
};

export const profileEditAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.profileEdit,
  attrs: {},
};

export const homeAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.home,
};

export const reloadAction: ComponentActionDto = {
  label: '',
  value: '',
  action: null,
  type: ActionType.reload,
};

export const openDropdownModalAction: ComponentActionDto = {
  label: '',
  value: 'test',
  action: null,
  type: ActionType.dropdownListModal,
};

export const openConfirmationModalAction: ComponentActionDto = {
  label: 'test',
  value: 'confirmation',
  action: null,
  type: ActionType.confirmModalStep,
};

export const redirectAction: ComponentActionDto = {
  label: 'redirect',
  value: '#',
  action: DTOActionAction.redirect,
  type: ActionType.redirect,
};

export const redirectToPayByUinAction: ComponentActionDto = {
  label: 'Начать',
  value: '',
  type: ActionType.redirectToPayByUin,
  action: DTOActionAction.redirectToPayByUin,
};

export const copyToClipboardAction: ComponentActionDto = {
  label: 'Скопировать',
  value: 'Скопирована ссылка:',
  action: null,
  type: ActionType.copyToClipboard,
  attrs: {},
};

export const downloadSpAdapterPdfAction: ComponentActionDto = {
  label: 'Скачать PDF',
  value: 'pdfName=Название_файла',
  type: ActionType.downloadSpAdapterPdf,
  action: DTOActionAction.spAdapterPdf,
};
