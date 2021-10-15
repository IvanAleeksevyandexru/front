import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import DepartmentLookupModelAttrs from './DepartmentLookupModelAttrs';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';
import DictionaryLikeModel from '../../component-list-resolver/DictionaryLikeModel';
import { AbstractControl } from '@angular/forms';
import { ListItem } from '@epgu/ui/models/dropdown';

export default class DepartmentLookupModel extends DictionaryLikeModel {
  type = CustomScreenComponentTypes.DropDownDepts;

  getAttrs(attrs: CustomComponentAttr): DepartmentLookupModelAttrs {
    return new DictionarySharedAttrs(attrs);
  }

  patchControlValue(control: AbstractControl, _): boolean {
    if (this.attrs.defaultIndex !== undefined) {
      const lockedValue = this.attrs?.lockedValue;
      const dictionary = this._dictionary$.getValue();
      if ((lockedValue && !dictionary?.repeatedWithNoFilters) || dictionary?.list?.length === 1) {
        const value: ListItem = dictionary?.list[this.attrs.defaultIndex];
        control.get('value').patchValue(value);
      }
      return true;
    }
  }
}
