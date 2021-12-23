export interface CheckboxChange {
  changes: CubeElements;
  isValid: boolean;
}

export interface CubeElements {
  [id: string]: CubeElement;
}

export interface CubeElement {
  label: string;
  value: boolean;
}

export interface Checkbox {
  id: string;
  label: string;
}
