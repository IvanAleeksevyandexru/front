import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';

export const mockData: ComponentAttrsDto = {
  participant: {
    role: 'ChildrenAbove14',
    mode: 'SlaveApplicant',
  },
  fields: [
    {
      mask: ['/\\d/', '/\\d/', '/\\d/', '/\\d/'],
      fieldName: 'rfPasportSeries',
      label: 'Серия',
      type: 'input',
      regexp: '^[0-9]{4}$',
      errorMsg: 'Поле должно содержать 4 цифры',
    },
    {
      mask: ['/\\d/', '/\\d/', '/\\d/', '/\\d/', '/\\d/', '/\\d/'],
      fieldName: 'rfPasportNumber',
      label: 'Номер',
      type: 'input',
      regexp: '^[0-9]{6}$',
      errorMsg: 'Поле должно содержать 6 цифр',
    },
  ],
};
