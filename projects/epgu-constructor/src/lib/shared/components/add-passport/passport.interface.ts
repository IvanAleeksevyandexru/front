export interface PassportAttr {
  participant: { role: string; mode: string };
  fields: PassportField[];
  titleHide?: boolean;
}

export type PassportFieldName = 'rfPasportSeries' | 'rfPasportNumber';

export interface PassportField {
  mask: string[];
  fieldName: PassportFieldName;
  label: string;
  type: 'input';
  regexp: string | RegExp;
  errorMsg: string;
  placeholder?: string;
  maxlength?: number;
  minlength?: number;
  suggestionId?: string;
}

export type PassportFormFields = { rfPasportNumber: string; rfPasportSeries: string };
