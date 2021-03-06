import { CustomComponentAttr } from '../../components-list.types';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';
import { Clarifications } from '@epgu/epgu-constructor-types';

export default class MultipleChoiceDictionaryModelAttrs extends DictionarySharedAttrs {
  readonly subLabel: string;

  readonly modalHeader: string;

  readonly customUnrecLabel: string;

  readonly clarifications: Clarifications;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.subLabel = attrs.subLabel;
    this.modalHeader = attrs.modalHeader;
    this.customUnrecLabel = attrs.customUnrecLabel;
    this.clarifications = attrs.clarifications;
  }

  public isLoadingNeeded(): boolean {
    return super.isLoadingNeeded() && !this.dictionaryList;
  }
}
