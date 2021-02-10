import { ServiceResult } from '../../car-info/models/car-info.interface';
import {
  ComponentActionDto,
  ComponentAttrsDto
} from '../../../../../form-player/services/form-player-api/form-player-api.types';


export interface CarListComponentAttrsDto extends ComponentAttrsDto {
  errors: CarInfoErrorsDto;
}

export interface CarInfoErrorsDto {
  EXTERNAL_SERVER_ERROR?: ErrorTemplate,
  NOT_FOUND_ERROR?: ErrorTemplate
}

export interface ErrorTemplate {
  display: ErrorDisplayDto;
  actions: ComponentActionDto[];
}

export interface ErrorDisplayDto {
  imageClass: string;
  imageSrc: string;
  title: string;
  label: string;
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