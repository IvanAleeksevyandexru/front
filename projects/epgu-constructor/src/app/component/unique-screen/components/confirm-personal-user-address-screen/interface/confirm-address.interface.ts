import { RelativeDate } from 'epgu-lib';
import { UniqueScreenComponentTypes } from '../../../unique-screen-components.types';
import { TextTransform } from 'epgu-constructor-types/dist/base/text-transform';
import { FieldNames } from '../../registration-addr/registration-addr-screen.types';

/**
 * @property {Array<object>}attrs
 * @property {string}id
 * @property {string}label
 * @property {UniqueScreenComponentTypes}type
 * @property {string}value - JSON stringify, that contain data attr.fields
 */
export interface ConfirmAddressInterface {
  attrs: ConfirmAddressInterfaceAttr;
  id: string;
  label: string;
  type: UniqueScreenComponentTypes;
  value: string;
  required: boolean;
  valueFromCache: boolean;
}

interface ConfirmAddressInterfaceAttr {
  actions: Array<ConfirmAddressActionsInterface>;
  fields: Array<ConfirmAddressFieldsInterface>;
  fstuc?: TextTransform;
  hideLevels?: Array<string>;
  minDate?: Date | RelativeDate | string;
  maxDate?: Date | RelativeDate | string;
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
export interface ConfirmAddressFieldsInterface {
  fieldName: FieldNames;
  label: string;
  attrs?: { labelHint?: string };
  hint?: string;
  nonPresetable?: boolean;
}
