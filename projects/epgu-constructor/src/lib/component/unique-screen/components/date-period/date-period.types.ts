export interface DatePeriodState {
  startDate: string | null;
  endDate: string | null;
}

export interface DatePeriodFormValues {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DatePeriodFormState extends DatePeriodFormValues {
  isValid: boolean;
}
