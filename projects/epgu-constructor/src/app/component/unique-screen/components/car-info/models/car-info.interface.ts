export type LegalInfo = 'PLEDGED' | 'WANTED' | 'RESTRICTIONS';
export type OwnerType = 'INDIVIDUAL' | 'LEGAL_ENTITY';
export type StatusType = 'REGISTERED' | 'NOT_REGISTERED' | 'REMOVED' | 'SUSPENDED';
export type ServiceType = 'vehicle' | 'notary';

export interface TenureDates {
  from: number;
  to: number;
}

export interface CarInfo {
  vehicleInfo: VehicleInfo;
  notaryInfo: NotaryInfo;
  errors: CarInfoError[];
}

export interface CarInfoErrors {
  vehicle: CarInfoDisplayedError;
  notary: CarInfoDisplayedError;
}


export interface CarInfoError {
  type: string;
  service: ServiceType;
}

export interface CarInfoDisplayedError {
  type: string;
  service: ServiceType;
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
  enginePower: string;
  lastRegActionName: string;
  restrictions: Restriction[];
  ownerPeriods: OwnerPeriod[];
}

interface OwnerPeriod {
  ownerType: string;
  dateStart: string;
  dateEnd: string;
  date: string;
}

interface Restriction {
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

export interface CarInfoErrorsDto {
  EXTERNAL_SERVER_ERROR?: string,
  NOT_FOUND_ERROR?: string
}
