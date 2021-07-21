import { ActionType, ComponentActionDto, DTOActionAction } from '@epgu/epgu-constructor-types';

export const NEXT_STEP_ACTION: ComponentActionDto = {
  label: 'Продолжить',
  action: DTOActionAction.getNextStep,
  type: ActionType.nextStep,
};

export const EXTERNAL_INTEGRATION_ACTION: ComponentActionDto = {
  label: 'Попробовать снова',
  action: DTOActionAction.externalIntegrationAction,
  type: ActionType.externalIntegration,
};
