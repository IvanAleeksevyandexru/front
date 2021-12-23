import BaseModel from '../../component-list-resolver/BaseModel';
import CheckboxCubeItemModelAttrs from './CheckboxCubeItemModelAttrs';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';

export default class CheckboxCubeItemModel extends BaseModel<CheckboxCubeItemModelAttrs> {
  type = CustomScreenComponentTypes.CheckboxCube;

  getAttrs(attrs: CustomComponentAttr): CheckboxCubeItemModelAttrs {
    return new CheckboxCubeItemModelAttrs(attrs);
  }
}
