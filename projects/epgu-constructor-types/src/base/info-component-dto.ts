import { Gender } from './gender';

export enum UserInfoComponentTypes {
  PersonInfo = 'PersonInfo',
  CycledInfo = 'CycledInfo',
}

export interface CycledInfo {
  fieldName: string;
  format?: string;
  isBold: boolean;
  value: string;
}

export enum AgeType {
  MATURE = 'MATURE',
  YOUNG = 'YOUNG',
}

export interface UserInfo {
  name: string;
  ageText: string;
  ageType: AgeType;
  gender: Gender;
}

export interface InfoComponentField {
  fieldName: string;
}

export interface InfoComponentDto {
  id: string;
  type: UserInfoComponentTypes;
  attrs: {
    fields: InfoComponentField[];
    hidden?: boolean;
  };
  value: string;
}
