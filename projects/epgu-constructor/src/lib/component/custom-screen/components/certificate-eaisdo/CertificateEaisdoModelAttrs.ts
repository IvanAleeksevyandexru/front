import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class CertificateEaisdoModelAttrs extends GenericAttrs {
  readonly wait: string;
  readonly error: string;
  readonly errorButton: string;
  readonly orderId: string;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);
    this.wait = attrs.wait;
    this.error = attrs.error as unknown as string;
    this.errorButton = attrs.errorButton;
    this.orderId = attrs.orderId;
  }
}
