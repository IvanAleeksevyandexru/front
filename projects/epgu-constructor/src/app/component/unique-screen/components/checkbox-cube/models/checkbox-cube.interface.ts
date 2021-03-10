import { ComponentAttrsDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';

export interface CheckboxCubeComponentAttrsDto extends ComponentAttrsDto {
  cubeElements: {[id: string]: CubeElement};
}

export interface CubeElement {
  label: string;
  value: boolean;
}

export interface Checkbox {
  id: string;
  label: string;
}
