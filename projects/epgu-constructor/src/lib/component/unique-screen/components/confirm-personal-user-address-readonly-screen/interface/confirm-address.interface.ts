import { RelativeDate } from '@epgu/epgu-lib';
import { TextTransform, DisclaimerDto, Clarifications } from '@epgu/epgu-constructor-types';
import { UniqueScreenComponentTypes } from '../../../unique-screen-components.types';
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
  clarifications?: Clarifications;
  actions: ConfirmAddressActionsInterface[];
  fields: ConfirmAddressFieldsInterface[];
  fstuc?: TextTransform;
  hideLevels?: string[];
  minDate?: Date | RelativeDate | string;
  maxDate?: Date | RelativeDate | string;
  disclaimer?: DisclaimerDto;
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

export interface ConfirmAddressReadonlyValue {
  fullAddress: object;
  regAddr: string;
  regDate?: string | Date;
}
