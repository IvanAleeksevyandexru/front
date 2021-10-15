import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import EaisdoGroupCostAttrs from './EaisdoGroupCostAttrs';

export default class EaisdoGroupCostModel extends BaseModel<EaisdoGroupCostAttrs> {
  readonly type = CustomScreenComponentTypes.EaisdoGroupCost;
  readonly arguments: {financialSource: string, typeOfBudget: string};

  getAttrs(attrs: CustomComponentAttr): EaisdoGroupCostAttrs {
    return new EaisdoGroupCostAttrs(attrs);
  }
}
