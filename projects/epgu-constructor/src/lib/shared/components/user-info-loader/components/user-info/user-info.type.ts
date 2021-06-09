export enum AgeType {
  MATURE = 'MATURE',
  YOUNG = 'YOUNG',
}

export enum Gender {
  M = 'M',
  F = 'F',
}

export type IconItem = { M: string; F: string };
export type IconList = { MATURE: IconItem; YOUNG: IconItem };

export interface UserInfoType {
  name: string;
  ageText: string;
  ageType: AgeType;
  gender: Gender;
}
