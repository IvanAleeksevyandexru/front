import { MonthYear } from 'epgu-lib/lib/models/date-time.model';

export interface EmployeeHistoryDataSource {
  label: string;
  type: EmployeeType;
  position: string;
  positionHint?: string;
  place: string;
  placeHint?: string;
  address: string;
}

export interface EmployeeHistoryModel {
  type: EmployeeType,
  from: MonthYear,
  to: MonthYear,
  position: string,
  place: string,
  address: string,
  checkboxToDate?: boolean;
  minDateTo?: MonthYear;
}

export interface EmployeeHistoryAvailableDates {
  date: string;
  checked: boolean;
}

export type EmployeeType = 'employed' | 'unemployed' | 'military' | 'student';
