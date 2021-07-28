export interface IuikFullDataResponse {
  address: string;
  commissionId: string;
  commissionName: string;
  description: string;
  elections: election[];
  inUserDistrict: boolean;
  phone: string;
  pollStationNumber: string;
  pollStationRegion: string;
  pollStationType: string;
}

export interface election {
  district: string;
  electionId: string;
  electionName: string;
}
