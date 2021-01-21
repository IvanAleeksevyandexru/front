export type LegalInfo = 'PLEDGED' | 'WANTED' | 'RESTRICTIONS';
export type OwnerType = 'INDIVIDUAL' | 'LEGAL_ENTITY';
export type StatusType = 'REGISTERED' | 'NOT_REGISTERED' | 'REMOVED' | 'SUSPENDED';


export interface TenureDates {
  from: number;
  to: number;
}

export interface CarInfo {
  vehicleInfo: VehicleInfo;
  notaryInfo: NotaryInfo;
  errors: CarInfoError[];
}

interface CarInfoError {
  type: string;
  service: string;
}

interface NotaryInfo {
  isPledged: boolean;
  pledging: string;
}

export interface VehicleInfo {
  status: string;
  stsSeriesNumber: string;
  restrictionsFlag: boolean;
  category: string;
  searchingTransport: string;
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
