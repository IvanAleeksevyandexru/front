import { CustomComponentAttr } from '../../components-list.types';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';

export default class MultipleChoiceDictionaryModelAttrs extends DictionarySharedAttrs {
  readonly subLabel: string;

  readonly modalHeader: string;

  readonly customUnrecLabel: string;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.subLabel = attrs.subLabel;
    this.modalHeader = attrs.modalHeader;
    this.customUnrecLabel = attrs.customUnrecLabel;
  }
}
