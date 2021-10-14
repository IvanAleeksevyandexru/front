import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class CheckboxInputModelAttrs extends GenericAttrs  {
  readonly isHorizontal: boolean;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.isHorizontal = attrs.isHorizontal;
  }
}
