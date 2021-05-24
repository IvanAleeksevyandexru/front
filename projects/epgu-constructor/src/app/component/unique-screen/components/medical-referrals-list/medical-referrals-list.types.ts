export interface Referral {
  referralId: string;
  referralNumber: string;
  referralTypeId: string;
  referralStartDate: string;
  referralEndDate: string;
  paymentSourceId: string;
  toMoOid: string;
  toMoName: string;
  toSpecsId: string;
  toSpecsName: string;
  toResourceName: string;
  fromMoOid: string;
  fromMoName: string;
  fromSpecsId: string;
  fromSpecsName: string;
  fromResourceName: string;
  originalItem: Item;
}

export interface ReferralsListResponse {
  totalItems: number;
  items: Item[];
  version: string;
  error: Error;
}

export interface Error {
  errorDetail: ErrorDetail;
  fieldErrors: any[];
}

export interface ErrorDetail {
  errorCode: number;
  errorMessage: string;
}

export interface Item {
  parentItem: null;
  children: any[];
  fields: Fields;
  attributes: Attribute[];
}

export interface Attribute {
  name: string;
  value: string;
}

export interface Fields {
  itemName: null;
  title: null;
}
