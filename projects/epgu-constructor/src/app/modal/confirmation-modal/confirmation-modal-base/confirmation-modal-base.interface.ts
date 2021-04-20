import { ComponentActionDto } from 'epgu-constructor-types/dist/base/component-action-dto';

export interface ConfirmationModalBaseButton {
  label: string;
  color?: '' | 'white' | 'transparent';
  loader?: boolean;
  handler?: Function;
  value?: string; // TODO переделать на OK и CANCEL actions
  action?: ComponentActionDto;
}
