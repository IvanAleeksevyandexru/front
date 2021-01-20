import { MonthYear } from 'epgu-lib/lib/models/date-time.model';
import { ComponentBase } from '../../../../screen/screen.types';
import { TextTransform } from '../../../../shared/types/textTransform';

export interface EmployeeHistoryDataSource {
  label: string;
  type: EmployeeType;
  position: string;
  positionHint?: string;
  place: string;
  placeHint?: string;
  address: string;
}

interface EmployeeHistoryDate {
  month: number;
  year: number;
  monthCode: string;
}

interface EmployeeHistoryBaseModel {
  type: EmployeeType;
  position: string;
  place: string;
  address: string;
  checkboxToDate?: boolean;
}

export interface EmployeeHistoryServerModel extends EmployeeHistoryBaseModel {
  label: string;
  from: EmployeeHistoryDate;
  to: EmployeeHistoryDate;
}

export interface EmployeeHistoryModel extends EmployeeHistoryBaseModel {
  from: MonthYear;
  to: MonthYear;
  minDateTo?: MonthYear;
  error?: string;
}

export interface EmployeeHistoryAvailableDates {
  date: string;
  checked: boolean;
}

export interface EmployeeHistoryUncheckedPeriod {
  from: string;
  to: string;
}

export type EmployeeType = 'employed' | 'unemployed' | 'military' | 'student';

export interface EmployeeHistoryComponentInterface extends ComponentBase {
  attrs: {
    fstuc?: TextTransform;
  };
}
