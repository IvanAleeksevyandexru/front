import {ComponentActionInterface} from './component-action.interface';

export interface SimpleComponentInterface {
  header: string,
  label?: string,
  actions?: ComponentActionInterface[]
  submitButtonLabel?: string,
  attrs?: any
}
