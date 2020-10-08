import { ComponentBase } from '../../../../../../screen/screen.types';

export interface ChildItem {
  isNew?: boolean,
  id: number,
  birthDate: string,
  gender: string,
  firstName: string,
  lastName: string,
  middleName: string,
  rfBirthCertificateSeries: string,
  rfBirthCertificateNumber: string,
  rfBirthCertificateActNumber: string,
  rfBirthCertificateIssueDate: string,
  rfBirthCertificateIssuedBy: string,
  relationshipToChild: string,
  registrationAddress: string,
  registrationAddressDate: string
}

export interface SelectChildrenInterface extends ComponentBase {
  attrs: Array<any>,
  id: string,
  label: string,
  type: string,
  value: string,
  visited: boolean,
}