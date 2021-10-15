import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import FieldListModelAttrs from './FieldListModelAttrs';

export default class FieldListModel extends BaseModel<FieldListModelAttrs> {
  type = CustomScreenComponentTypes.FieldList;

  getAttrs(attrs: CustomComponentAttr): FieldListModelAttrs {
    return new FieldListModelAttrs(attrs);
  }
}
