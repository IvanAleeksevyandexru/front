export interface ISuggestionItem {
  mnemonic: string;
  list: ISuggestionItemList[];
  isEdit?: boolean;
}

export interface ISuggestionItemList {
  value: string;
  mnemonic: string;
  hints?: ISuggestionItemListHints[];
  originalItem?: string;
  id?: number;
  componentsGroupIndex?: number;
}

export interface ISuggestionItemListHints {
  mnemonic: string;
  value: string;
}

export interface ISuggestionApi {
  mnemonic: string;
  multiple: boolean;
  values: ISuggestionApiValue[];
}

export interface ISuggestionApiValue {
  createdOn: string;
  fields: ISuggestionApiValueField[];
  id: number;
}

export interface ISuggestionApiValueField {
  keyField: boolean;
  mnemonic: string;
  value: string;
}
