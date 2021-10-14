import { Clarifications } from '@epgu/epgu-constructor-types';
import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class FormOutputModelAttrs extends GenericAttrs {
  readonly clarifications: Clarifications;
  readonly interpolationEnabled: boolean;
  readonly isBottomSlot: boolean;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.clarifications = attrs.clarifications;
    this.interpolationEnabled = attrs.interpolationEnabled;
  }
}
