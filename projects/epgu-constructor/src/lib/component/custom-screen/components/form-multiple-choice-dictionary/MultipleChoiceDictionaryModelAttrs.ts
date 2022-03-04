import {
  Clarifications,
  ComponentDictionaryFilterDto,
  DictionaryOptions,
} from '@epgu/epgu-constructor-types';
import {
  CustomComponentAttr,
  CustomComponentDropDownItemList,
  MappingParamsDto,
} from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class MultipleChoiceDictionaryModelAttrs extends GenericAttrs {
  readonly dictionaryList: CustomComponentDropDownItemList;

  readonly dictionaryType: string;

  readonly subLabel: string;

  readonly modalHeader: string;

  readonly dictionaryFilter: ComponentDictionaryFilterDto[];

  readonly customUnrecLabel: string;

  readonly dictionaryOptions: DictionaryOptions;

  readonly mappingParams: MappingParamsDto;

  readonly clarifications: Clarifications;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.dictionaryList = attrs.dictionaryList;
    this.dictionaryType = attrs.dictionaryType as string;
    this.subLabel = attrs.subLabel;
    this.modalHeader = attrs.modalHeader;
    this.dictionaryFilter = attrs.dictionaryFilter;
    this.customUnrecLabel = attrs.customUnrecLabel;
    this.dictionaryOptions = attrs.dictionaryOptions;
    this.mappingParams = attrs.mappingParams;
    this.clarifications = attrs.clarifications;
  }
}
