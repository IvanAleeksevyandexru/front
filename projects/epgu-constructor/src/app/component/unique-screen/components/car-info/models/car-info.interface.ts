import { ComponentAttrsDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { VehicleOwnerInfo } from '../../car-list/models/car-list.interface';

export enum ServiceResult {
  SUCCESS = 'SUCCESS',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  EXTERNAL_SERVER_ERROR = 'EXTERNAL_SERVER_ERROR',
}


export interface CarInfo {
  vehicleInfo: VehicleInfo;
  notaryInfo: NotaryInfo;
  vehicleServiceCallResult: ServiceResult;
  notaryServiceCallResult: ServiceResult;
}

export interface CarInfoErrors {
  vehicle?: CarInfoDisplayedError;
  notary?: CarInfoDisplayedError;
  externalCommon?: CarInfoDisplayedError;
}

export interface CarInfoDisplayedError {
  type: string;
  text: string;
}

interface NotaryInfo {
  isPledged: boolean;
}

export interface VehicleInfo {
  status: string;
  stsSeriesNumber: string;
  restrictionsFlag: boolean;
  category: string;
  searchingTransportFlag: boolean;
  carcaseColor: string;
  markName: string;
  modelName: string;
  modelMarkName: string;
  manufacturedYear: string;
  govRegNumber: string;
  recordStatus: string;
  vin: string;
  chassisNumber: string;
  carcaseNumber: string;
  vehicleType: string;
  engineVolume: string;
  enginePowerHorse: string;
  enginePowerVt: string;
  lastRegActionName: string;
  restrictions: Restriction[];
  ownerPeriods: OwnerPeriod[];
}

export interface OwnerPeriod {
  ownerType: string;
  dateStart: string;
  dateEnd: string;
}

export interface Restriction {
  restrictionType: string;
  status: string;
  restrictionDate: string;
  initiateRegion: string;
  gibddDepart: string;
  mainReason: string;
  restrictionDesc: string;
  enforcementProceedingsNumber: string;
  enforcementProceedingsDate: string;
  enforcementProceedingsName: string;
}

export interface CarInfoComponentAttrsDto extends ComponentAttrsDto {
  errors: CarInfoErrorsDto;
}

export interface CarInfoErrorsDto {
  EXTERNAL_SERVER_ERROR?: string,
  NOT_FOUND_ERROR?: string
}

export interface OwnerCarInfo {
  vehicleInfo: VehicleOwnerInfo;
  notaryInfo: NotaryInfo;
  vehicleServiceCallResult: ServiceResult;
  notaryServiceCallResult: ServiceResult;
  ownerInfo: OwnerInfo;
}

export interface OwnerInfo {
  fullName: string;
  document: Document;
}

export interface Document {
  series: string;
  number: string;
  issueDate: string;
}

