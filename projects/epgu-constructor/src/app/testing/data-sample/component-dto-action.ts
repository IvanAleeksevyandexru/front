import {
  ActionType,
  ComponentDtoAction,
  DTOActionAction,
} from '../../form-player/services/form-player-api/form-player-api.types';

export const componentDtoActionSample1: ComponentDtoAction = {
  label: 'label1',
  value: 'value1',
  action: DTOActionAction.editEmail,
};
