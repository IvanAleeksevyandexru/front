import { ComponentDto } from @epgu/'@epgu/epgu-constructor-types';
import { TextTransform } from @epgu/'@epgu/epgu-constructor-types';

export const componentMock: ComponentDto = {
  id: 'ai15',
  type: 'ChildrenList',
  label: 'Ещё ребёнок от 14 до 18 лет',
  attrs: {
    isCycled: true,
    minAge: 14,
    maxAge: 17,
    components: [
      {
        id: 'ai15_0',
        type: 'StringInput',
        createOrder: false,
        label: 'Идентификатор',
        attrs: {
          fields: [{ fieldName: 'id' }],
          validation: [
            {
              type: 'RegExp',
              value: '.+',
              ref: '',
              dataType: '',
              condition: '',
              errorMsg: 'Поле не может быть пустым',
            },
          ],
          hidden: true,
        },
        value: '',
        required: true,
      },
      {
        id: 'ai15_3',
        type: 'StringInput',
        createOrder: false,
        label: 'Фамилия',
        attrs: {
          fstuc: 'all',
          fields: [{ fieldName: 'lastName' }],
          validation: [
            {
              type: 'RegExp',
              value: '.+',
              ref: '',
              dataType: '',
              condition: '',
              errorMsg: 'Поле не может быть пустым',
            },
            {
              type: 'RegExp',
              value: '^.{0,30}$',
              ref: '',
              dataType: '',
              condition: '',
              errorMsg: 'Поле может содержать не более 30 символов',
            },
          ],
        },
        value: '',
        required: true,
      },
      {
        id: 'ai15_4',
        type: 'StringInput',
        createOrder: false,
        label: 'Имя',
        attrs: {
          fstuc: 'all',
          fields: [{ fieldName: 'firstName' }],
          validation: [
            {
              type: 'RegExp',
              value: '.+',
              ref: '',
              dataType: '',
              condition: '',
              errorMsg: 'Поле не может быть пустым',
            },
            {
              type: 'RegExp',
              value: '^.{0,30}$',
              ref: '',
              dataType: '',
              condition: '',
              errorMsg: 'Поле может содержать не более 30 символов',
            },
          ],
        },
        value: '',
        required: true,
      },
      {
        id: 'ai15_5',
        type: 'StringInput',
        createOrder: false,
        label: 'Отчество',
        attrs: {
          fstuc: TextTransform.FIRST,
          customUnrecLabel: 'При наличии',
          fields: [{ fieldName: 'middleName' }],
          validation: [
            {
              type: 'RegExp',
              value: '^.{0,30}$',
              ref: '',
              dataType: '',
              condition: '',
              errorMsg: 'Поле может содержать не более 30 символов',
            },
          ],
        },
        value: '',
        required: false,
      },
      {
        id: 'ai15_7',
        type: 'PassportLookup',
        createOrder: false,
        label: '',
        attrs: {
          participant: { role: 'ChildrenAbove14', mode: 'SlaveApplicant' },
          ref: [{ relatedRel: 'ai15_6', val: 'true', relation: 'displayOn' }],
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
        },
        value: '',
        required: true,
      },
      {
        id: 'ai15_6',
        type: 'RadioInput',
        createOrder: false,
        label: 'Ребенок новый?',
        attrs: {
          components: ['ai15_7'],
          defaultValue: 'true',
          fields: [{ fieldName: 'isNew' }],
          supportedValues: [
            { label: 'Да', value: 'true' },
            { label: 'Нет', value: 'false' },
          ],
          isHorizontal: true,
          hidden: true,
        },
        value: '',
        required: true,
      },
    ],
    refs: {},
  },
  linkedValues: [],
  arguments: {},
  value: '[]',
  required: true,
};
