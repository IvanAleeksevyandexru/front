export interface ConfirmEmailInterface {
  // "id": "pd3",
  // "type": "ConfirmUserEmail",
  'header': string,
  'label': string,
  'content': string,
  // "image": "",
  'supportedValues': [],
  'actions': Array<ConfirmEmailActionInterface>,
  'fields': [],
  // "visited": false
}

export interface ConfirmEmailActionInterface {
  'label': string,
  'method': string
}
