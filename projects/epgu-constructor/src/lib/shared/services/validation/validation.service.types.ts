export interface ValidatorDate {
  dateValidator: boolean;
}

export enum ValidationType {
  regExp = 'RegExp',
  regExpException = 'RegExpException',
  date = 'Date',
  checkRS = 'checkRS',
  maritalStatusYear = 'MaritalStatusYear',
  maritalStatusRank = 'MaritalStatusRank',
}

export type DateValidationCondition = '<' | '<=' | '>' | '>=';
