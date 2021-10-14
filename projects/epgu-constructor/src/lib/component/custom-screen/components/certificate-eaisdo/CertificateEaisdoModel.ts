import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomComponentAttr, CustomScreenComponentTypes } from '../../components-list.types';
import CertificateEaisdoModelAttrs from './CertificateEaisdoModelAttrs';

export default class CertificateEaisdoModel extends BaseModel<CertificateEaisdoModelAttrs> {
  type = CustomScreenComponentTypes.CertificateEaisdo;

  getAttrs(attrs: CustomComponentAttr): CertificateEaisdoModelAttrs {
    return new CertificateEaisdoModelAttrs(attrs);
  }

}
