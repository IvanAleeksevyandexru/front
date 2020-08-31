export interface EmployeeHistoryDataSource {
  label: string;
  value: number;
  position: string;
  place: string;
}

export interface EmployeeHistoryModel {
  type: number,
  from: string,
  to: string,
  position: string,
  place: string,
  address: string,
  checkboxToDate?: boolean;
}

export interface EmployeeHistoryAvailableDates {
  date: string;
  checked: boolean;
}