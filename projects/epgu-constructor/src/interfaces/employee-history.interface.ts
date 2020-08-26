export interface IEmployeeHistoryDataSource {
  label: string;
  value: number;
  position: string;
  place: string;
}

export interface IEmployeeHistoryModel {
  type: number,
  from: string,
  to: string,
  position: string,
  place: string,
  address: string,
}