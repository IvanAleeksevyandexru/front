export interface EmployeeHistoryDataSource {
  label: string;
  value: Employee;
  position: string;
  place: string;
}

export interface EmployeeHistoryModel {
  type: Employee,
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

export type Employee = 'employed' | 'unemployed' | 'military' | 'student';