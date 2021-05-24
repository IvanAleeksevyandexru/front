import { ActionType, ComponentActionDto, DTOActionAction } from 'epgu-constructor-types';

export const NEXT_STEP_ACTION: ComponentActionDto = {
  label: 'Продолжить',
  action: DTOActionAction.getNextStep,
  type: ActionType.nextStep,
};
