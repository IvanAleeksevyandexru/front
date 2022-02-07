import { ComponentDictionaryFilterDto } from '@epgu/epgu-constructor-types';
import { CustomComponentAttr, CustomComponentDropDownItemList } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class MultipleChoiceDictionaryModelAttrs extends GenericAttrs {
  readonly dictionaryList: CustomComponentDropDownItemList;

  readonly dictionaryType: string;

  readonly subLabel: string;

  readonly modalHeader: string;

  readonly dictionaryFilter: ComponentDictionaryFilterDto[];

  readonly customUnrecLabel: string;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.dictionaryList = attrs.dictionaryList;
    this.dictionaryType = attrs.dictionaryType as string;
    this.subLabel = attrs.subLabel;
    this.modalHeader = attrs.modalHeader;
    this.dictionaryFilter = attrs.dictionaryFilter;
    this.customUnrecLabel = attrs.customUnrecLabel;
  }
}
