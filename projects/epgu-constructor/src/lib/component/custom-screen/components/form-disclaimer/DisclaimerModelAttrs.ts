import { Clarifications } from '@epgu/epgu-constructor-types';
import { CustomComponentAttr } from '../../components-list.types';

export default class DisclaimerModelAttrs {
  readonly type: string;
  readonly title: string;
  readonly description: string;
  readonly clarifications: Clarifications;

  constructor(attrs: CustomComponentAttr) {
    this.clarifications = attrs.clarifications;
    this.title = attrs.title;
    this.type = attrs.type;
    this.description = attrs.description;

  }
}
