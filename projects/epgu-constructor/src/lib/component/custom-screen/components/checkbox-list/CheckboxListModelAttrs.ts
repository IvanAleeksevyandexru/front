import { CheckboxListElement } from './checkbox-list.types';
import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class CheckboxInputModelAttrs extends GenericAttrs {
  readonly labelShow?: string;
  readonly labelHide?: string;
  readonly checkBoxes: {
    [id: string]: CheckboxListElement;
  };

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.labelHide = attrs.labelHide;
    this.checkBoxes = attrs.checkBoxes;
    this.labelShow = attrs.labelShow;
  }
}
