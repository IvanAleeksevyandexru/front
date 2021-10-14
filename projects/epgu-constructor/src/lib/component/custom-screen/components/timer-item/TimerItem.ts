import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import TimerItemModelAttrs from './TimerItemModelAttrs';

export default class TimerItemModel extends BaseModel<TimerItemModelAttrs> {
  type = CustomScreenComponentTypes.Timer;

  getAttrs(attrs: CustomComponentAttr): TimerItemModelAttrs {
    return new TimerItemModelAttrs(attrs);
  }
}
