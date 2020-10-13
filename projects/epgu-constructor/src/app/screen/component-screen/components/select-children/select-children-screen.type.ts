import { ComponentBase } from '../../../../screen/screen.types';

export interface SelectChildrenInterface extends ComponentBase {
  attrs: Array<any>,
  id: string,
  label: string,
  type: string,
  value: string,
  visited: boolean,
}