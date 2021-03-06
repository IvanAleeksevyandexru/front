import { ActionType, ComponentActionDto, DTOActionAction } from '@epgu/epgu-constructor-types';

export const NEXT_STEP_ACTION: ComponentActionDto = {
  label: 'Продолжить',
  action: DTOActionAction.getNextStep,
  type: ActionType.nextStep,
};

export const PREV_STEP_ACTION: ComponentActionDto = {
  label: 'Назад',
  action: DTOActionAction.getPrevStep,
  type: ActionType.prevStep,
};

export const SAVE_STEP_ACTION: ComponentActionDto = {
  label: '',
  action: DTOActionAction.getSaveCacheToDraft,
  type: ActionType.saveCacheToDraft,
};

export const EXTERNAL_INTEGRATION_ACTION: ComponentActionDto = {
  label: 'Попробовать снова',
  action: DTOActionAction.externalIntegrationAction,
  type: ActionType.externalIntegration,
};
