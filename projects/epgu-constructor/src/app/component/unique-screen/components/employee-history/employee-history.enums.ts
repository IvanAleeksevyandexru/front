export enum EmployeeHistoryErrors {
  FailedDateTo = 'Дата окончания не может быть раньше, чем дата начала',
  FailedPeriod = 'Указанный период деятельности не входит в последние 10 лет',
}

export const EmployeeHistoryMaxLengthValidators: Record<'position' | 'place' | 'address', { maxLength: number, errorMsg: string }> = {
  position: { maxLength: 150, errorMsg: 'Максимальная длина поля 150 символов' },
  place: { maxLength: 255, errorMsg: 'Максимальная длина поля 255 символов' },
  address: { maxLength: 150, errorMsg: 'Максимальная длина поля 150 символов' },
};
