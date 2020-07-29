export interface ConfirmPhoneInterface {
  // "id": "pd3",
  // "type": "ConfirmUserEmail",
  'header': string;
  'label': string;
  'content': string;
  // "image": "",
  'supportedValues': [];
  'attrs': { 'actions': Array<ConfirmPhoneActionInterface> };
  'fields': [];
  // "visited": false
}

export interface ConfirmPhoneActionInterface {
  'label': string;
  'method': string;
}
