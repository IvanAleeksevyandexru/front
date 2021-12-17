import { CheckboxListElement } from './checkbox-list.types';
import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class CheckboxInputModelAttrs extends GenericAttrs {
  readonly labelShow?: string;

  readonly labelHide?: string;

  readonly labelHint?: string;

  readonly limit?: number | string;

  readonly checkBoxes: {
    [id: string]: CheckboxListElement;
  };

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.labelHide = attrs.labelHide;
    this.labelHint = attrs.labelHint;
    this.checkBoxes = attrs.checkBoxes;
    this.labelShow = attrs.labelShow;
    this.limit = attrs.limit;
  }
}
