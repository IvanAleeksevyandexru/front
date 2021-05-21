import { ListElement } from 'epgu-lib/lib/models/dropdown.model';

export interface DateTimePeriodState {
  startDateTime: string | null;
  endDateTime: string | null;
}

export interface DateTimePeriodFormValues {
  startDate: Date | null;
  startTime: ListElement | null;
  endDate: Date | null;
  endTime: ListElement | null;
}
