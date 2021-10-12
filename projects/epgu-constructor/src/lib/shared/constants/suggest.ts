export enum SuggestActions {
  DOWNLOAD_ACTION = 'nsiSuggestDownloadUploadedFile',
  ADD_ACTION = 'nsiSuggestReuseUploadedFile',
  REUSE_ACTION = 'nsiSuggestReuseFieldValue',
}

export type FieldTypes =
  | 'UPLOAD_DOWNLOAD_BUTTON'
  | 'UPLOAD_ADD_BUTTON'
  | 'DROPDOWN'
  | 'LOOKUP'
  | 'DADATA_WIDGET'
  | 'MASKED_INPUT'
  | 'PLAIN_INPUT';
