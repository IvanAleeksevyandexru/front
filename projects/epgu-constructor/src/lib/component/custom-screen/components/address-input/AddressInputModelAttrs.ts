import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';
import { Clarifications } from '@epgu/epgu-constructor-types';

export default class AddressInputModelAttrs extends GenericAttrs {
  readonly hideHouseCheckbox: boolean;

  readonly hideApartmentCheckbox: boolean;

  readonly selectHouseCheckbox: boolean;

  readonly selectApartmentCheckbox: boolean;

  readonly hideLevels: string[];

  readonly customUnrecLabel: string;

  readonly clarifications: Clarifications;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.hideHouseCheckbox = attrs.hideHouseCheckbox;
    this.hideApartmentCheckbox = attrs.hideApartmentCheckbox;
    this.selectHouseCheckbox = attrs.selectHouseCheckbox;
    this.selectApartmentCheckbox = attrs.selectApartmentCheckbox;
    this.hideLevels = attrs.hideLevels;
    this.customUnrecLabel = attrs.customUnrecLabel;
    this.clarifications = attrs.clarifications;
  }
}
