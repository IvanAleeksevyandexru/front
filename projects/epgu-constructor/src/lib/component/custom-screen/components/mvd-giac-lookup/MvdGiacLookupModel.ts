import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';

import MvdGiacLookupModelAttrs from './MvdGiacLookupModelAttrs';
import DropDownLikeModel from '../../component-list-resolver/DropDownLikeModel';

export default class MvdGiacLookupModel extends DropDownLikeModel {
  type = CustomScreenComponentTypes.MvdGiac;

  getAttrs(attrs: CustomComponentAttr): MvdGiacLookupModelAttrs {
    return new MvdGiacLookupModelAttrs(attrs);
  }
}
