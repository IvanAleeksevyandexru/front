import { ComponentScreenComponentTypes } from '../../../../../component-screen-components.types';
import { TextTransform } from '../../../../../../../shared/types/textTransform';
import { RelativeDate } from 'epgu-lib';


/**
 * @property {Array<object>}attrs
 * @property {string}id
 * @property {string}label
 * @property {ComponentScreenComponentTypes}type
 * @property {string}value - JSON stringify, that contain data attr.fields
 */
export interface ConfirmAddressInterface {
  attrs: ConfirmAddressInterfaceAttr;
  id: string;
  label: string;
  type: ComponentScreenComponentTypes;
  value: string;
  required: boolean;
}

interface ConfirmAddressInterfaceAttr {
  actions: Array<ConfirmAddressActionsInterface>;
  fields: Array<ConfirmAddressFieldsInterface>;
  fstuc?: TextTransform;
}

/**
 * @property {string}action - action name
 * @property {string}label - action text
 * @property {string}value - action value
 */
export interface ConfirmAddressActionsInterface {
  action: string;
  label: string;
  value: string;
}

export type ConfirmAddressFieldName = 'regAddr' | 'regFrom' | 'regTo' | 'regDate';

/**
 * @property {string}fieldName - field id
 * @property {string}label - field name
 */
interface ConfirmAddressFieldsInterface {
  fieldName: ConfirmAddressFieldName;
  label: 'адрес';
  minDate?: Date | RelativeDate | string;
  maxDate?: Date | RelativeDate | string;
  attrs?: { labelHint?: string };
  hint?: string;
}
