import { ActionType, ComponentActionDto, DTOActionAction } from '../../form-player/services/form-player-api/form-player-api.types';

export const NEXT_STEP_ACTION: ComponentActionDto = {
  label: 'Продолжить',
  action: DTOActionAction.getNextStep,
  type: ActionType.nextStep,
};
