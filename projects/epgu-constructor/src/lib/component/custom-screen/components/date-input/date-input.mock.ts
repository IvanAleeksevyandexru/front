export const mockComponent = {
  id: 'cl11_4',
  name: '<b>Дата рождения</b>',
  type: 'DateInput',
  createOrder: false,
  checkForDuplicate: false,
  clearCacheForComponentIds: [],
  label: '<b>Дата рождения</b>',
  skipValidation: false,
  attrs: {
    fields: [
      {
        fieldName: 'birthDate',
      },
    ],
    accuracy: 'day',
    minDate: '-7y11m29d',
    maxDate: 'today',
    validation: [
      {
        type: 'RegExp',
        value: '.*',
        ref: '',
        condition: '',
        errorMsg: 'Поле должно быть заполнено',
      },
      {
        type: 'Date',
        value: '',
        ref: '',
        condition: '<',
        errorMsg: 'Возраст ребёнка не должен превышать 7 лет',
      },
      {
        type: 'Date',
        value: '',
        ref: '',
        condition: '>',
        errorMsg: 'Дата рождения ребёнка не должна быть больше текущей даты',
      },
    ],
  },
  linkedValues: [
    {
      version: 1,
      argument: 'minDate',
      jsonLogic: {
        value: 'variable.today',
        type: 'DateToString',
        accuracy: '',
        add: {
          year: -8,
          day: 1,
        },
      },
      converterSettings: {
        converter: 'DATE',
        format: 'dd.MM.yyyy',
        path: '',
      },
      jsonSource: false,
    },
  ],
  arguments: {
    minDate: '22.12.2013',
  },
  value: '',
  required: true,
  sendAnalytics: false,
};
