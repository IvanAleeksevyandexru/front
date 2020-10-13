import { ComponentScreenComponentTypes } from '../../../../../component-screen.types';
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

/**
 * @property {string}fieldName - field id
 * @property {string}label - field name
 */
interface ConfirmAddressFieldsInterface {
  fieldName: 'regAddr';
  label: 'адрес';
  minDate?: Date | RelativeDate | string;
  maxDate?: Date | RelativeDate | string;
}
