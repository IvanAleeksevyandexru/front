import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import DocInputModelAttrs from './DocInputModelAttrs';

export default class DocInputModel extends BaseModel<DocInputModelAttrs> {
  type = CustomScreenComponentTypes.DocInput;

  getAttrs(attrs: CustomComponentAttr): DocInputModelAttrs {
    return new DocInputModelAttrs(attrs);
  }
}
