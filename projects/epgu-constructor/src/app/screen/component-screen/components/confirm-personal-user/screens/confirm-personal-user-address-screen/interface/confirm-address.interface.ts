import { SCREEN_COMPONENT_NAME } from '../../../../../../../shared/constant/global';

/**
 * @property {Array<object>}attrs
 * @property {string}id
 * @property {string}label
 * @property {SCREEN_COMPONENT_NAME}type
 * @property {string}value - JSON stringify, that contain data attr.fields
 */
export interface ConfirmAddressInterface {
  attrs: ConfirmAddressInterfaceAttr;
  id: string;
  label: string;
  type: SCREEN_COMPONENT_NAME;
  value: string;
}

interface ConfirmAddressInterfaceAttr {
  actions: Array<ConfirmAddressActionsInterface>;
  fields: Array<ConfirmAddressFieldsInterface>;
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
  fieldName: 'regAddr'
  label: 'адрес'
}
