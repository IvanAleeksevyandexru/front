import { ComponentAttrsDto } from 'epgu-constructor-types/dist/base/component-attrs';

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
