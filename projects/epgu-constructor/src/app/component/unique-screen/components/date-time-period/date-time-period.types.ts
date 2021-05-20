import { ListElement } from '@epgu/epgu-lib';

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
