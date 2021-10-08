import { ConfirmPersonalUserDataPipe } from './confirm-personal-user-data.pipe';
import { ComponentDto, FieldGroup } from '@epgu/epgu-constructor-types';
import { InterpolationService } from '../../../../../../shared/services/interpolation/interpolation.service';

const componentValue = {
  states: [
    {
      groupName: 'Фёдоров Фёдор Акакиевич',
      fields: [
        {
          label: 'Дата рождения',
          value: '30.09.1987'
        }
      ]
    },
    {
      groupName: 'Паспорт гражданина РФ',
      fields: [
        {
          label: 'Серия и номер',
          value: '1234 554642'
        },
        {
          label: 'Дата выдачи',
          value: '08.07.2015'
        },
        {
          label: 'Кем выдан',
          value: 'УФМС 5656'
        },
        {
          label: 'Код подразделения',
          value: '490-001'
        }
      ]
    }
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
    citizenshipCode: 'RUS'
  },
  errors: []
};

const fieldGroups: FieldGroup[] = [
  {
    groupName: '${lastName} ${firstName} ${middleName}',
    fields: [
      {
        label: 'Дата рождения',
        value: '${birthDate}'
      }
    ]
  },
  {
    groupName: 'Паспорт гражданина РФ',
    fields: [
      {
        label: 'Серия и номер',
        value: '${rfPasportSeries} ${rfPasportNumber}'
      },
      {
        label: 'Код подразделения',
        value: '${rfPasportIssuedByIdFormatted}'
      },
      {
        label: 'Дата выдачи',
        value: '${rfPasportIssueDate}'
      },
      {
        label: 'Кем выдан',
        value: '${rfPasportIssuedBy}'
      },
      {
        label: 'Дополнительное рандомное поле',
        value: '${citizenshipCode} ${citizenship}'
      },
    ]
  }
] as FieldGroup[];

const componentData = {
  id: 'comp1',
  type: 'ConfirmPersonalUser',
  value: JSON.stringify(componentValue),
} as ComponentDto;

describe('ConfirmPersonalUserDataPipe', () => {
  let pipe: ConfirmPersonalUserDataPipe;
  let service: InterpolationService;
  beforeEach( () => {
    service = {
      interpolateRecursive: jest.fn().mockReturnValue([{ result: 'resultOfInterpolation' }])
    } as unknown as InterpolationService;
    pipe = new ConfirmPersonalUserDataPipe(service);
  });

  it('should return the same value if no fieldGroup attrs', () => {
    expect(pipe.transform(componentData)).toBe(componentData);
    expect(service.interpolateRecursive).not.toHaveBeenCalled();
  });

  describe('when have fieldGroups', function () {
    const setup = (fieldGroups: FieldGroup[] = null) => {

      return { ...componentData, attrs: { ...componentData.attrs, fieldGroups }};
    };

    it('should return the same value if no fieldGroup attrs', () => {
      const data = setup(fieldGroups);
      const expected = {
        ...data,
        presetValue: JSON.stringify({
          ...JSON.parse(data.value),
          states: [{ result: 'resultOfInterpolation' }],
        }),
      };

      expect(pipe.transform(data)).toStrictEqual(expected);
      expect(service.interpolateRecursive).toHaveBeenCalledTimes(1);
      expect(service.interpolateRecursive).toHaveBeenCalledWith(fieldGroups, componentValue.storedValues);
    });
  });
});
