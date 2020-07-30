import {ConfirmAddress} from 'epgu-lib';

export interface ConfirmAddressInterface {
  // "id": "pd4",
  // "type": "ConfirmUserRegistrationAddr",
  'header': string;
  // "label": "",
  'image': "";
  'supportedValues': Array<ConfirmAddressSupportedValues>;
  'actions': Array<ConfirmAddressActionInterface>;
  // "fields": [],
  // "visited": false
}

interface ConfirmAddressActionInterface {
  'label': string;
  'method': string;
}

export interface ConfirmAddressSupportedValues {
  'title': string;
  'content': string;
}


