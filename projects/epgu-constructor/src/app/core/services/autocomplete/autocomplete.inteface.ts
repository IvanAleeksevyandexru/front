export interface ISuggestionItem {
  mnemonic: string;
  list: ISuggestionItemList[];
  isEdit?: boolean;
}

export interface ISuggestionItemList {
  value: string;
  mnemonic: string;
  hints?: ISuggestionItemListHints[];
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
  createdOn: string;
}

export interface ISuggestionApiGroup {
  suggestionGroupId: string;
  values: ISuuggestionApiGroupValue[];
}

export interface ISuuggestionApiGroupValue {
  suggestionId: string;
  value: string;
}
