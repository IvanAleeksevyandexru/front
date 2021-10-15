import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class CityInputModelAttrs extends GenericAttrs {
  readonly searchType: string;
  readonly cityFilter: string[];
  readonly hideLevels: string[];

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.searchType = attrs.searchType;
    this.cityFilter = attrs.cityFilter;
    this.hideLevels = attrs.hideLevels;
  }
}
