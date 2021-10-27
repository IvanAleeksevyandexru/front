export interface IuikFullDataResponse {
  address: string;
  commissionId: string;
  commissionName: string;
  description: string;
  elections: Ielection[];
  inUserDistrict: boolean;
  phone: string;
  pollStationNumber: string;
  pollStationRegion: string;
  pollStationType: string;
}

export interface Ielection {
  district: string;
  districtNo: string;
  electionId: string;
  electionName: string;
  userDistrictEqalUikDistrict: boolean;
}
