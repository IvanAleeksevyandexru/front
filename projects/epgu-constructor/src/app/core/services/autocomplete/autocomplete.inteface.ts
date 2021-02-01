export interface ISuggestionItem {
  mnemonic: string;
  list: ISuggestionItemList[];
  isEdit?: boolean;
}

export interface ISuggestionItemList {
  value: string;
  mnemonic: string;
  hints?: ISuggestionItemListHints[];
  groupIdx?: number;
}

export interface ISuggestionItemListHints {
  mnemonic: string;
  value: string;
}

export interface ISuggestionApi {
  fields: ISuggestionApiField[];
  groups: ISuggestionApiGroup[];
}

export interface ISuggestionApiField {
  suggestionId: string;
  values: ISuggestionApiFieldsValue[];
}

export interface ISuggestionApiFieldsValue {
  value: string;
  createdOn?: string;
  groupIdx?: number;
}

export interface ISuggestionApiGroup {
  suggestionGroupId: string;
  values: ISuggestionApiGroupValue[][];
}

export interface ISuggestionApiGroupValue {
  suggestionId: string;
  value: string;
}
