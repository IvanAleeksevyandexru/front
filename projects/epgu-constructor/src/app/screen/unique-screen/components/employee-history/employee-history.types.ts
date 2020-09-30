import { MonthYear } from 'epgu-lib/lib/models/date-time.model';

export interface EmployeeHistoryDataSource {
  label: string;
  type: Employee;
  position: string;
  place: string;
  address: string;
}

export interface EmployeeHistoryModel {
  type: Employee,
  from: MonthYear,
  to: MonthYear,
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
