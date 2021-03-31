import { ComponentAttrsDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { Checkbox } from '../../../unique-screen/components/checkbox-cube/models/checkbox-cube.interface';

export interface CheckboxListComponentAttrsDto extends ComponentAttrsDto {
  labelShow?: string;
  labelHide?: string;
  checkBoxes: {
    [id: string]: CheckboxListElement;
  };
}

export interface CheckboxListElement {
  label: string;
  value: boolean;
  showOn: boolean;
}

export type CheckboxList = Checkbox & { showOn: boolean; hidden: boolean };
