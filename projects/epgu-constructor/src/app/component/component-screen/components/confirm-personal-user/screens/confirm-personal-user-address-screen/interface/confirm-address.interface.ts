import { RelativeDate } from 'epgu-lib';
import { TextTransform } from '../../../../../../../shared/types/textTransform';
import { ComponentScreenComponentTypes } from '../../../../../component-screen-components.types';


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
  hideLevels?: Array<string>;
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
export interface ConfirmAddressFieldsInterface {
  fieldName: ConfirmAddressFieldName;
  label: 'адрес';
  minDate?: Date | RelativeDate | string;
  maxDate?: Date | RelativeDate | string;
  attrs?: { labelHint?: string };
  hint?: string;
  nonPresetable?: boolean;
}
