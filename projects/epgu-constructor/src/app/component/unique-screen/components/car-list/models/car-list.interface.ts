import { ServiceResult } from '../../car-info/models/car-info.interface';
import { ComponentActionDto, ComponentAttrsDto } from '@epgu/epgu-constructor-types';

export interface CarListComponentAttrsDto extends ComponentAttrsDto {
  errors: CarInfoErrorsDto;
}

export interface CarInfoErrorsDto {
  EXTERNAL_SERVER_ERROR?: ErrorTemplate;
  NOT_FOUND_ERROR?: ErrorTemplate;
}

export interface ErrorTemplate {
  label: string;
  actions: ComponentActionDto[];
}

export interface CarList {
  vehicles: VehicleOwnerInfo[];
  vehicleServiceCallResult: ServiceResult;
}

export interface VehicleOwnerInfo {
  status: string;
  stsSeriesNumber: string;
  stsDocumentDate: string;
  stsIssueAgency: string;
  ptsType: string;
  ptsNum: string;
  ptsRegDate: string;
  ptsIssueAgency: string;
  engineModel: string;
  engineNum: string;
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
  leasingFlag: boolean;
  uniqueRowNumber: string;
  searchingSpec?: SearchingSpec;
  regActions?: RegActions[];
  manufacturer?: string;
  vin2?: string;
  vehicleTypeTAM?: string;
  ecologyClass?: string;
  transmissionTypeDesc?: string;
  wheelLocationDesc?: string;
  driveUnitTypeDesc?: string;
  approveSerNum?: string;
  utilizStatus?: string;
  tdtpo?: string;
  customsRestrictions?: string;
  engineType: string;
}

interface OwnerPeriod {
  ownerType: string;
  dateStart: string;
  dateEnd: string;
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

export interface SearchingSpec {
  searchingSpecFlag: boolean;
  specProductType: string;
  operationDate: string;
  techOperation: string;
  subDivision: string;
}

export interface RegActions {
  confidentSign: boolean;
  leasingFlag: boolean;
  regActionName: string;
  regDate: string;
  regDepartment: string;
}
