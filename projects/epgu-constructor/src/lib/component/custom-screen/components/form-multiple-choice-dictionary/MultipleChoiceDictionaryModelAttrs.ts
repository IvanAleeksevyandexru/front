import { ComponentDictionaryFilterDto } from '@epgu/epgu-constructor-types';
import { CustomComponentAttr, CustomComponentDropDownItemList } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class MultipleChoiceDictionaryModelAttrs extends GenericAttrs {
  readonly dictionaryList: CustomComponentDropDownItemList;
  readonly dictionaryType: string;
  readonly subLabel: string;
  readonly modalHeader: string;
  readonly withAmount: boolean;
  readonly dictionaryFilter: ComponentDictionaryFilterDto[];

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.dictionaryList = attrs.dictionaryList;
    this.dictionaryType = attrs.dictionaryType as string;
    this.subLabel = attrs.subLabel;
    this.modalHeader = attrs.modalHeader;
    this.withAmount = attrs.withAmount;
    this.dictionaryFilter = attrs.dictionaryFilter;
  }
}
