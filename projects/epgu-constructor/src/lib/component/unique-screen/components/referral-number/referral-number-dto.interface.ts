import { ArgumentsDto } from '@epgu/epgu-constructor-types';

export interface IReferralNumberErrorDto {
  imgSrc?: string;
  label?: string;
}

export interface IReferralNumberAttrsDto {
  placeholderText?: string;
  label: string;
  imgSrc?: string;
  helperText?: string;
  findReferralLabel?: string;
  error: IReferralNumberErrorDto;
}

export interface IReferralNumberDto {
  id: string;
  attrs: IReferralNumberAttrsDto;
  label: string;
  arguments?: ArgumentsDto;
}

export interface IGetReferralResponseErrorDetailDto {
  errorCode: number;
  errorMessage: string;
}

export interface IGetReferralResponseErrorDto {
  errorDetail: IGetReferralResponseErrorDetailDto;
  fieldErrors: [];
}

export interface IGetReferralResponseItemAttributeDto {
  name: string;
  value: string;
}

export interface IGetReferralResponseItemDto {
  parentItem: null;
  children: [];
  fields: {
    itemName: null;
    title: null;
  };
  attributes: IGetReferralResponseItemAttributeDto[];
}

export interface IGetReferralResponseDto {
  totalItems: number;
  items: IGetReferralResponseItemDto[];
  version: null|string;
  error: IGetReferralResponseErrorDto;
}
