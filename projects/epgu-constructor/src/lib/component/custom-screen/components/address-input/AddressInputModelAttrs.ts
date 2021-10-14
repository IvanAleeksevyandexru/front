import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class AddressInputModelAttrs extends GenericAttrs {
  readonly hideHouseCheckbox: boolean;
  readonly hideApartmentCheckbox: boolean;
  readonly selectHouseCheckbox: boolean;
  readonly selectApartmentCheckbox: boolean;
  readonly hideLevels: string[];

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.hideApartmentCheckbox = attrs.hideHouseCheckbox;
    this.hideApartmentCheckbox = attrs.hideApartmentCheckbox;
    this.selectHouseCheckbox = attrs.selectHouseCheckbox;
    this.selectApartmentCheckbox = attrs.selectApartmentCheckbox;
    this.hideLevels = attrs.hideLevels;
  }
}
