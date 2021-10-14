import { PassportField } from '../../../../shared/components/add-passport/passport.interface';
import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class PassportLookupModelAttrs extends GenericAttrs {
  readonly participant: { role: string; mode: string };
  readonly fields: PassportField[];
  readonly titleHide?: boolean;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.participant = attrs.participant;
    this.fields = attrs.fields as PassportField[];
    this.titleHide = attrs.titleHide;
  }

}
