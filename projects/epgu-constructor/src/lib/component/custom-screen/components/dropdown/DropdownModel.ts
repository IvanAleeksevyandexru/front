import { BehaviorSubject } from 'rxjs';
import { ListItem } from '@epgu/ui/models/dropdown';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import DropdownModelAttrs from './DropdownModelAttrs';
import DropDownLikeModel from '../../component-list-resolver/DropDownLikeModel';

export default class DropdownModel extends DropDownLikeModel {
  get dropDown$(): BehaviorSubject<Partial<ListItem>[]> {
    return this._dropDown$;
  }

  type = CustomScreenComponentTypes.DropDown;

  getAttrs(attrs: CustomComponentAttr): DropdownModelAttrs {
    return new DropdownModelAttrs(attrs);
  }
}
