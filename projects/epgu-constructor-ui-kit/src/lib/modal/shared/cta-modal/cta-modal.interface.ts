import { ComponentActionDto, ComponentAnswerDto } from '@epgu/epgu-constructor-types';

export interface ConfirmationModalBaseButton {
  label?: string;
  color?: '' | 'white' | 'transparent';
  loader?: boolean;
  handler?: Function;
  value?: string; // TODO переделать на OK и CANCEL actions
  action?: ComponentActionDto;
  closeModal?: boolean;
}

export interface ConfirmationModalAnswerButton extends Partial<ComponentAnswerDto> {}
