import { ComponentActionDto } from '../../../form-player/services/form-player-api/form-player-api.types';

export interface ConfirmationModalBaseButton {
  label: string;
  color?: '' | 'white' | 'transparent';
  loader?: boolean;
  handler?: Function;
  value?: string; // TODO переделать на OK и CANCEL actions
  action?: ComponentActionDto;
}
