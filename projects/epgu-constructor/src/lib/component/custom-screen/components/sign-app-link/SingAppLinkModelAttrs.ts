import GenericAttrs from '../../component-list-resolver/GenericAttrs';
import { CustomComponentAttr } from '../../components-list.types';
import { AppLink } from './sign-app-link.types';

export default class SingAppLinkModelAttrs extends GenericAttrs {
  readonly appLinks: AppLink[];

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.appLinks = attrs.appLinks;
  }
}
