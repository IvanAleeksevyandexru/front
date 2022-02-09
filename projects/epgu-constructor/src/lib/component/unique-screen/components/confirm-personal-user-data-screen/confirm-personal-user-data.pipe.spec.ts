import { ComponentDto, FieldGroup } from '@epgu/epgu-constructor-types';
import { ConfirmPersonalUserDataPipe } from './confirm-personal-user-data.pipe';
import { InterpolationService } from '../../../../shared/services/interpolation/interpolation.service';
import { DEFAULT_FIELD_LIST } from './component/confirm-personal-user-data/default-field-list';

const componentValue = {
  states: [
    {
      groupName: 'Фёдоров Фёдор Акакиевич',
      fields: [
        {
          label: 'Дата рождения',
          value: '30.09.1987',
        },
      ],
    },
    {
      groupName: 'Паспорт гражданина РФ',
      fields: [
        {
          label: 'Серия и номер',
          value: '1234 554642',
        },
        {
          label: 'Дата выдачи',
          value: '08.07.2015',
        },
        {
          label: 'Кем выдан',
          value: 'УФМС 5656',
        },
        {
          label: 'Код подразделения',
          value: '490-001',
        },
      ],
    },
  ],
  storedValues: {
    firstName: 'Фёдор',
    lastName: 'Фёдоров',
    middleName: 'Акакиевич',
    birthDate: '30.09.1987',
    gender: 'M',
    genderFull: 'Мужской',
    docType: 'RF_PASSPORT',
    rfPasportSeries: '1234',
    rfPasportNumber: '554642',
    rfPasportIssueDate: '08.07.2015',
    rfPasportIssuedBy: 'УФМС 5656',
    rfPasportIssuedById: '490001',
    rfPasportIssuedByIdFormatted: '490-001',
    citizenship: 'РОССИЯ',
    citizenshipCode: 'RUS',
  },
  errors: [],
};

const fieldGroups: FieldGroup[] = [
  {
    groupName: '${lastName} ${firstName} ${middleName}',
    fields: [
      {
        label: 'Дата рождения',
        value: '${birthDate}',
      },
    ],
  },
  {
    groupName: 'Паспорт гражданина РФ',
    fields: [
      {
        label: 'Серия и номер',
        value: '${rfPasportSeries} ${rfPasportNumber}',
      },
      {
        label: 'Код подразделения',
        value: '${rfPasportIssuedByIdFormatted}',
      },
      {
        label: 'Дата выдачи',
        value: '${rfPasportIssueDate}',
      },
      {
        label: 'Кем выдан',
        value: '${rfPasportIssuedBy}',
      },
      {
        label: 'Дополнительное рандомное поле',
        value: '${citizenshipCode} ${citizenship}',
      },
    ],
  },
] as FieldGroup[];

const resultOfInterpolation: FieldGroup[] = [
  {
    groupName: 'Иванов Иван Иванович',
    fields: [
      {
        label: 'Дата рождения',
        value: '9.9.1999',
      },
    ],
  },
  {
    groupName: 'Паспорт гражданина РФ',
    fields: [
      {
        label: 'Серия и номер',
        value: '9999 999999',
      },
      {
        label: 'Код подразделения',
        value: '99-99',
      },
      {
        label: 'Дата выдачи',
        value: '9.9.2019',
      },
      {
        label: 'Кем выдан',
        value: 'тем кто выдаёт',
      },
      {
        label: 'Дополнительное рандомное поле',
        value: '99 RUS',
      },
    ],
  },
] as FieldGroup[];

const componentData = {
  id: 'comp1',
  type: 'ConfirmPersonalUser',
  value: JSON.stringify(componentValue),
} as ComponentDto;

const componentDataWithFields = {
  id: 'comp1',
  type: 'ConfirmPersonalUser',
  value: JSON.stringify(componentValue),
  attrs: {
    keepVariables: true,
    fields: [
      {
        label: 'Дата рождения',
        value: '${birthDate}',
        fieldName: 'birthDate',
      },
      {
        label: 'Место рождения',
        value: '${birthPlace}',
        fieldName: 'birthPlace',
      },
    ],
  },
} as ComponentDto;

const componentDataWithFieldsGroup = {
  id: 'comp1',
  type: 'ConfirmPersonalUser',
  value: JSON.stringify(componentValue),
  attrs: {
    keepVariables: true,
    fieldGroups: [
      {
        groupName: '${lastName} ${firstName} ${middleName}',
        fields: [
          {
            label: 'Дата рождения',
            value: '${birthDate}',
          },
        ],
      },
      {
        groupName: 'Паспорт гражданина РФ',
        fields: [
          {
            label: 'Серия и номер',
            value: '${rfPasportSeries} ${rfPasportNumber}',
          },
        ],
      },
    ],
    fields: [
      {
        label: 'Дата рождения',
        value: '${birthDate}',
        fieldName: 'birthDate',
      },
      {
        label: 'Место рождения',
        value: '${birthPlace}',
        fieldName: 'birthPlace',
      },
    ],
  },
} as ComponentDto;

const resultOfRemoveFieldsOutsideJson = [
  {
    fields: [
      {
        fieldName: 'birthDate',
        label: 'Дата рождения',
        value: '${birthDate}',
      },
      {
        fieldName: 'birthPlace',
        label: 'Место рождения',
        value: '${birthPlace}',
      },
    ],
    groupName: '${lastName} ${firstName} ${middleName}',
    visibilityLabel: '',
  },
  {
    fields: [],
    groupName: 'Паспорт гражданина РФ',
    visibilityLabel: '',
  },
  {
    fields: [],
    groupName: 'Загранпаспорт гражданина РФ',
    visibilityLabel: '',
  },
  {
    fields: [],
    groupName: 'Паспорт иностранного гражаина',
    visibilityLabel: '',
  },
];

const argRemoveGroupIfFieldsEmptyOrWithoutValue: FieldGroup[] = [
  {
    groupName: 'Иванов Иван Иванович',
    fields: [
      {
        label: 'Дата рождения',
        value: '9.9.1999',
      },
    ],
  },
  {
    groupName: 'Паспорт гражданина РФ',
    fields: [
      {
        label: 'Серия и номер',
        value: '${undefined}',
      },
    ],
  },
  {
    groupName: 'Паспорт инстранного гражданина',
    fields: [
      {
        label: 'Серия и номер',
        value: '-',
      },
    ],
  },
] as FieldGroup[];

const resultRemoveGroupIfFieldsEmptyOrWithoutValue: FieldGroup[] = [
  {
    groupName: 'Иванов Иван Иванович',
    fields: [
      {
        label: 'Дата рождения',
        value: '9.9.1999',
      },
    ],
  },
] as FieldGroup[];

describe('ConfirmPersonalUserDataPipe', () => {
  let pipe: ConfirmPersonalUserDataPipe;
  let service: InterpolationService;
  beforeEach(() => {
    service = ({
      interpolateRecursive: jest.fn().mockReturnValue(resultOfInterpolation),
      variableRegExp: /\${(\w(\w|\d|_|\.)*)}/gi,
    } as unknown) as InterpolationService;
    pipe = new ConfirmPersonalUserDataPipe(service);
  });

  describe('if no fieldsGroup', () => {
    it('should call removeFieldsOutsideJson with attrs.fields, DEFAULT_FIELD_LIST', () => {
      const spy = jest.spyOn<any, any>(pipe, 'removeFieldsOutsideJson');
      pipe.transform(componentDataWithFields);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(componentDataWithFields.attrs.fields, DEFAULT_FIELD_LIST);
      expect(DEFAULT_FIELD_LIST).toStrictEqual(resultOfRemoveFieldsOutsideJson);
    });
    it('should call interpolateRecursive with resultOfRemoveFieldsOutsideJson', () => {
      pipe.transform(componentDataWithFields);
      expect(service.interpolateRecursive).toHaveBeenCalledTimes(1);
      expect(service.interpolateRecursive).toHaveBeenCalledWith(
        resultOfRemoveFieldsOutsideJson,
        componentValue.storedValues,
        '-',
        true,
      );
    });
  });

  describe('when have fieldGroups', () => {
    const setup = (fields: FieldGroup[] = null) => {
      return { ...componentData, attrs: { ...componentData.attrs, fieldGroups: fields } };
    };

    it('should not call removeFieldsOutsideJson', () => {
      const spy = jest.spyOn<any, any>(pipe, 'removeFieldsOutsideJson');
      pipe.transform(setup(fieldGroups));
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call interpolateRecursive with attrs.fieldGroups', () => {
      pipe.transform(componentDataWithFieldsGroup);
      expect(service.interpolateRecursive).toHaveBeenCalledTimes(1);
      expect(service.interpolateRecursive).toHaveBeenCalledWith(
        componentDataWithFieldsGroup.attrs.fieldGroups,
        componentValue.storedValues,
        '-',
        true,
      );
    });

    it('should return the same value if no fieldGroup attrs', () => {
      const data = setup(fieldGroups);
      const expected = {
        ...data,
        presetValue: JSON.stringify({
          ...JSON.parse(data.value),
          states: resultOfInterpolation,
        }),
      };
      expect(pipe.transform(data)).toStrictEqual(expected);
      expect(service.interpolateRecursive).toHaveBeenCalledTimes(1);
      expect(service.interpolateRecursive).toHaveBeenCalledWith(
        fieldGroups,
        componentValue.storedValues,
        '-',
        true,
      );
    });

    it('should removeGroupIfFieldsEmptyOrWithoutValue return only groups where fields with value', () => {
      const spy = jest.spyOn<any, any>(pipe, 'removeGroupIfFieldsEmptyOrWithoutValue');
      pipe.transform(componentDataWithFieldsGroup);
      expect(spy).toHaveBeenCalledWith(resultOfInterpolation);
      const resultOfSpyMethod = (pipe as any).removeGroupIfFieldsEmptyOrWithoutValue(
        argRemoveGroupIfFieldsEmptyOrWithoutValue,
      );
      expect(resultOfSpyMethod).toEqual(resultRemoveGroupIfFieldsEmptyOrWithoutValue);
    });

    it('should return the empty value if fieldGroup attrs and keepVariables is false', () => {
      const data = setup(fieldGroups);
      data.attrs.keepVariables = false;
      const expected = {
        ...data,
        presetValue: JSON.stringify({
          ...JSON.parse(data.value),
          states: resultOfInterpolation,
        }),
      };

      expect(pipe.transform(data)).toStrictEqual(expected);
      expect(service.interpolateRecursive).toHaveBeenCalledTimes(1);
      expect(service.interpolateRecursive).toHaveBeenCalledWith(
        fieldGroups,
        componentValue.storedValues,
        '-',
        false,
      );
    });

    describe('when some group has no fields', () => {
      it('should remove group with empty fields', () => {
        const resultOfInterpolationWithEmptyGroup = [
          ...resultOfInterpolation,
          {
            groupName: 'Паспорт иностранного гражданина',
            fields: [
              {
                label: 'Поле, которое не представленно массивом полей',
                value: '-',
              },
            ],
          },
        ];

        const fieldGroupsWithEmptyGroup = [
          ...fieldGroups,
          {
            groupName: 'Паспорт иностранного гражданина',
            fields: [
              {
                label: 'Поле, которое не представленно массивом полей',
                value: '${undefined}',
              },
            ],
          },
        ] as FieldGroup[];

        const interpolationSpy = jest
          .spyOn(service, 'interpolateRecursive')
          .mockReturnValue(resultOfInterpolationWithEmptyGroup);

        const data = setup(fieldGroupsWithEmptyGroup);
        const expected = {
          ...data,
          presetValue: JSON.stringify({
            ...JSON.parse(data.value),
            states: resultOfInterpolation,
          }),
        };

        expect(pipe.transform(data)).toStrictEqual(expected);
        expect(interpolationSpy).toHaveBeenCalledTimes(1);
        expect(interpolationSpy).toHaveBeenCalledWith(
          fieldGroupsWithEmptyGroup,
          componentValue.storedValues,
          '-',
          true,
        );
      });
    });
  });
});
