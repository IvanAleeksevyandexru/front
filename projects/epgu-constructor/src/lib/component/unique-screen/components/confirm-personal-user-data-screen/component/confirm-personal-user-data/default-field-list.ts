import { FieldGroup } from '@epgu/epgu-constructor-types';

export const DEFAULT_FIELD_LIST: FieldGroup[] = [
  {
    groupName: '${lastName} ${firstName} ${middleName} ${fullName}',
    visibilityLabel: '',
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
      {
        label: 'Полис ОМС',
        value: '${omsNumber}',
        fieldName: 'omsNumber',
      },
      {
        label: 'Серия ОМС',
        value: '${omsSeries} ${omsNumber}',
        fieldName: 'omsSeries',
      },
      {
        label: 'Пол',
        value: '${gender}',
        fieldName: 'gender',
      },
      {
        label: 'Пол, полное наименование',
        value: '${genderFull}',
        fieldName: 'genderFull',
      },
      {
        label: 'ИНН',
        value: '${inn}',
        fieldName: 'inn',
      },
      {
        label: 'КПП',
        value: '${kpp}',
        fieldName: 'kpp',
      },
      {
        label: 'Гражданство',
        value: '${citizenship}',
        fieldName: 'citizenship',
      },
      {
        label: 'Гражданство, код',
        value: '${citizenshipCode}',
        fieldName: 'citizenshipCode',
      },
      {
        label: 'СНИЛС',
        value: '${snils}',
        fieldName: 'snils',
      },
      {
        label: 'Код организации',
        value: '${orgCode}',
        fieldName: 'orgCode',
      },
      {
        label: 'Сокращенное наименование',
        value: '${shortName}',
        fieldName: 'shortName',
      },
      {
        label: 'ОГРН/ОГРНИП',
        value: '${ogrn}',
        fieldName: 'ogrn',
      },
      {
        label: 'Организационно правовая форма',
        value: '${opf}',
        fieldName: 'opf',
      },
      {
        label:
          'Код организационно-правовой формы по общероссийскому классификатору организационно-правовых форм',
        value: '${leg}',
        fieldName: 'leg',
      },
      {
        label: 'Организационно правовая форма',
        value: '${opf}',
        fieldName: 'opf',
      },
      {
        label: 'Имя руководителя организации',
        value: '${chiefFirstName}',
        fieldName: 'chiefFirstName',
      },
      {
        label: 'Фамилия руководителя организации',
        value: '${chiefLastName}',
        fieldName: 'chiefLastName',
      },
      {
        label: 'Отчество руководителя организации',
        value: '${chiefMiddleName}',
        fieldName: 'chiefMiddleName',
      },
      {
        label: 'Дата рождения руководителя организации',
        value: '${chiefBirthDate}',
        fieldName: 'chiefBirthDate',
      },
      {
        label: 'Должность руководителя организации',
        value: '${chiefPosition}',
        fieldName: 'chiefPosition',
      },
    ],
  },
  {
    groupName: 'Паспорт гражданина РФ',
    visibilityLabel: '',
    fields: [
      {
        label: 'Серия и номер',
        value: '${rfPasportSeries} ${rfPasportNumber}',
        fieldName: 'rfPasportSeries',
      },
      {
        label: 'Дата выдачи',
        value: '${rfPasportIssueDate}',
        fieldName: 'rfPasportIssueDate',
      },
      {
        label: 'Кем выдан',
        value: '${rfPasportIssuedBy}',
        fieldName: 'rfPasportIssuedBy',
      },
      {
        label: 'Код подразделения',
        value: '${rfPasportIssuedById}',
        fieldName: 'rfPasportIssuedById',
      },
      {
        label: 'Код подразделения',
        value: '${rfPasportIssuedByIdFormatted}',
        fieldName: 'rfPasportIssuedByIdFormatted',
      },
    ],
  },
  {
    groupName: 'Загранпаспорт гражданина РФ',
    visibilityLabel: '',
    fields: [
      {
        label: 'Серия и номер',
        value: '${frgnPasportSeries} ${frgnPasportNumber}',
        fieldName: 'frgnPasportSeries',
      },
      {
        label: 'Дата выдачи',
        value: '${frgnPasportIssueDate}',
        fieldName: 'frgnPasportIssueDate',
      },
      {
        label: 'Кем выдан',
        value: '${frgnPasportIssuedBy}',
        fieldName: 'frgnPasportIssuedBy',
      },
    ],
  },
  {
    groupName: 'Паспорт иностранного гражданина',
    visibilityLabel: '',
    fields: [
      {
        label: 'Серия и номер',
        value: '${foreignPasportSeries} ${foreignPasportNumber}',
        fieldName: 'foreignPasportSeries',
      },
      {
        label: 'Дата выдачи',
        value: '${foreignPasportIssueDate}',
        fieldName: 'foreignPasportIssueDate',
      },
    ],
  },
  {
    groupName: 'Свидетельство о рождении',
    visibilityLabel: '',
    fields: [
      {
        label: 'Серия и номер',
        value: '${rfBirthCertificateSeries} ${rfBirthCertificateNumber}',
        fieldName: 'rfBirthCertificateSeries',
      },
      {
        label: 'Дата выдачи',
        value: '${rfBirthCertificateIssueDate}',
        fieldName: 'rfBirthCertificateIssueDate',
      },
      {
        label: 'Кем выдан',
        value: '${rfBirthCertificateIssuedBy}',
        fieldName: 'rfBirthCertificateIssuedBy',
      },
    ],
  },
];
