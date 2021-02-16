import { ActionType, ComponentActionDto, DTOActionAction } from '../../form-player/services/form-player-api/form-player-api.types';

export const NEXT_STEP_ACTION: ComponentActionDto = {
  label: 'Продолжить',
  action: DTOActionAction.getNextStep,
  value: '',
  type: ActionType.nextStep,
};

export const ATTACH_UPLOADED_FILES: ComponentActionDto = {
  label: 'Ранее загруженные',
  action: DTOActionAction.attachUploadedFiles,
  value: '123',
  type: ActionType.attachUploadedFiles,
};