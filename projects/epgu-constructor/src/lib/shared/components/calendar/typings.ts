export type LockProvider = (
  day: Date,
  firstDayOfMainSection: Date,
  daysInMainSection: number,
) => boolean;

export interface Day {
  date: Date;
  locked: boolean;
}

export type MonthHideProvider = (date: Date) => boolean;
