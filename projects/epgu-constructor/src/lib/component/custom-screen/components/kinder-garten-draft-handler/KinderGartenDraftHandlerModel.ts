import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import KinderGartenDraftHandlerModelAttrs from './KinderGartenDraftHandlerModelAttrs';

export default class KinderGartenDraftHandlerModel extends BaseModel<KinderGartenDraftHandlerModelAttrs> {
  type = CustomScreenComponentTypes.KinderGartenDraftHandlerComponent;

  getAttrs(attrs: CustomComponentAttr): KinderGartenDraftHandlerModelAttrs {
    return new KinderGartenDraftHandlerModelAttrs(attrs);
  }
}
