import { TextTransform } from '../../types/textTransform';

export interface PassportAttr {
  participant:{ role: string; mode: string };
  fields: PassportFields[];
  fstuc?: TextTransform; // TODO проверить на наличие
}

export type PassportFieldName = 'rfPasportSeries' | 'rfPasportNumber';

export interface PassportFields {
  mask: Array<string>;
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
