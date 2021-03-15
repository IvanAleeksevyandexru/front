/* eslint-disable max-len */
import { ScreenTypes } from '../../../../../screen/screen.types';
import { DictionaryConditions } from '../../../../../shared/services/dictionary/dictionary-api.types';
import { Gender } from '../../../../../shared/types/gender';

export const mockSelectMapObjectStore = {
  serviceCode: '10000000105',
  targetCode: '-10000000105',
  orderId: 763712529,
  currentScenarioId: 1,
  currentUrl: 'http://local.test.gosuslugi.ru:4200/',
  finishedAndCurrentScreens: [
    's1',
    's2',
    's4',
    's5',
    's8',
    's9',
    's10',
    's11',
    's16',
    's17',
    's18',
    's19',
    's40',
    's21',
  ],
  cachedAnswers: {
    w1: { visited: true, value: '' },
    q1: { visited: true, value: 'Нет' },
    q3: { visited: true, value: 'Нет' },
    d1: { visited: true, value: '' },
    pd1: {
      visited: true,
      value:
        '{"states":[{"groupName":"Женихов Федя","fields":[{"label":"Дата рождения:","value":"12.12.1990"}]},{"groupName":"Паспорт гражданина РФ","fields":[{"label":"Серия и номер:","value":"0002 822822"},{"label":"Дата выдачи:","value":"24.12.2010"},{"label":"Кем выдан:","value":"Тестовый центр выдачи"},{"label":"Код подразделения:","value":"123-123"},{"label":"Место рождения:","value":"Симферополь"}]}],"storedValues":{"firstName":"Федя","lastName":"Женихов","middleName":"","birthDate":"12.12.1990","birthPlace":"Симферополь","gender":"M","docType":"RF_PASSPORT","rfPasportSeries":"0002","rfPasportNumber":"822822","rfPasportIssueDate":"24.12.2010","rfPasportIssuedBy":"Тестовый центр выдачи","rfPasportIssuedById":"123123","citizenship":"RUS","citizenshipCode":"RUS"},"errors":[]}',
    },
    pd2: { visited: true, value: '+7(999)6660808' },
    pd3: { visited: true, value: 'aprazhak@it-one.ru' },
    pd4: {
      visited: true,
      value:
        '{"regAddr":{"cityType":"","streetShortType":"ул","additionalStreetShortType":"","districtType":"","geoLat":"55.767754","building2Type":"","okato":"45263570000","building1Type":"","regionType":"город","additionalStreet":"","lat":"55.767754","apartmentCheckboxClosed":false,"houseCheckboxClosed":false,"streetType":"улица","town":"","lng":"37.7588133","index":"105187","townShortType":"","district":"","fullAddress":"105187, г. Москва, пр-кт. Елагинский, д. 9, кв. 87","houseCheckbox":false,"region":"Москва","geoLon":"37.7588133","additionalArea":"","apartmentType":"квартира","city":"","apartmentShortType":"кв","house":"9","apartmentCheckbox":false,"townType":"","additionalAreaType":"","regionShortType":"г","regionCode":"77","districtShortType":"","street":"Елагинский","additionalStreetType":"","inCityDistShortType":"","additionalAreaShortType":"","cityShortType":"","kladrCode":"77000000000358800","building1ShortType":"","fiasCode":"64fcea47-fc1f-4cc0-bc24-e40fa1c4e540","hasErrors":0,"inCityDistType":"","houseType":"дом","inCityDist":"","addressStr":"г. Москва, пр-кт. Елагинский","building1":"","building2":"","houseShortType":"д","building2ShortType":"","apartment":"87"}}',
    },
    fai16: { visited: true, value: '' },
    fai17: { visited: true, value: '' },
    fai19: { visited: true, value: '' },
    ai5i: { visited: true, value: 'Фыв' },
    sn1a: {
      visited: true,
      value:
        '{"birthDate":"19.02.1998","gender":"F","trusted":true,"citizenship":"RUS","snils":"010-000-303 20","biomStu":false,"verifying":false,"oid":"1000305286","exists":true,"age":23}',
    },
    sn2a: { visited: true, value: 'qwe@qwe.qwe' },
    pd6: {
      visited: true,
      value:
        '{"code":"0c5b2444-70a0-4932-980c-b4dc0d3f02b5","address":{"fiasCode":"0c5b2444-70a0-4932-980c-b4dc0d3f02b5","numericFiasCode":null,"fullAddress":"г Москва","postIndex":"101000","elements":[{"level":1,"levelType":null,"fiasCode":"0c5b2444-70a0-4932-980c-b4dc0d3f02b5","elmCode":null,"kladrCode":"7700000000000","oktmoCode":null,"data":"Москва","type":"город","shortType":"г","numericFiasCode":"77-0-000-000-000-000-0000-0000-000"}]},"level":1,"id":"0c5b2444-70a0-4932-980c-b4dc0d3f02b5","text":"г Москва","error":{"code":0,"message":"operation completed"},"dadataQc":"0","dadataQcComplete":"3","dadataQcHouse":"10","unparsedParts":null,"fiasLevel":"1","postalCode":"101000","postalBox":null,"regionKladrId":null,"okato":"45000000000","tax_office":"7700","oktmo":"45000000","geo_lat":"55.7540471","geo_lon":"37.620405","regionCode":"77"}',
    },
  },
  currentValue: {},
  errors: {},
  applicantAnswers: {
    w1: { visited: true, value: '' },
    q1: { visited: true, value: 'Нет' },
    q3: { visited: true, value: 'Нет' },
    d1: { visited: true, value: '' },
    pd1: {
      visited: true,
      value:
        '{"states":[{"groupName":"Женихов Федя","fields":[{"label":"Дата рождения:","value":"12.12.1990"}]},{"groupName":"Паспорт гражданина РФ","fields":[{"label":"Серия и номер:","value":"0002 822822"},{"label":"Дата выдачи:","value":"24.12.2010"},{"label":"Кем выдан:","value":"Тестовый центр выдачи"},{"label":"Код подразделения:","value":"123-123"},{"label":"Место рождения:","value":"Симферополь"}]}],"storedValues":{"firstName":"Федя","lastName":"Женихов","middleName":"","birthDate":"12.12.1990","birthPlace":"Симферополь","gender":"M","docType":"RF_PASSPORT","rfPasportSeries":"0002","rfPasportNumber":"822822","rfPasportIssueDate":"24.12.2010","rfPasportIssuedBy":"Тестовый центр выдачи","rfPasportIssuedById":"123123","citizenship":"RUS","citizenshipCode":"RUS"},"errors":[]}',
    },
    pd2: { visited: true, value: '+7(999)6660808' },
    pd3: { visited: true, value: 'aprazhak@it-one.ru' },
    pd4: {
      visited: true,
      value:
        '{"regAddr":{"cityType":"","streetShortType":"ул","additionalStreetShortType":"","districtType":"","geoLat":"55.767754","building2Type":"","okato":"45263570000","building1Type":"","regionType":"город","additionalStreet":"","lat":"55.767754","apartmentCheckboxClosed":false,"houseCheckboxClosed":false,"streetType":"улица","town":"","lng":"37.7588133","index":"105187","townShortType":"","district":"","fullAddress":"105187, г. Москва, пр-кт. Елагинский, д. 9, кв. 87","houseCheckbox":false,"region":"Москва","geoLon":"37.7588133","additionalArea":"","apartmentType":"квартира","city":"","apartmentShortType":"кв","house":"9","apartmentCheckbox":false,"townType":"","additionalAreaType":"","regionShortType":"г","regionCode":"77","districtShortType":"","street":"Елагинский","additionalStreetType":"","inCityDistShortType":"","additionalAreaShortType":"","cityShortType":"","kladrCode":"77000000000358800","building1ShortType":"","fiasCode":"64fcea47-fc1f-4cc0-bc24-e40fa1c4e540","hasErrors":0,"inCityDistType":"","houseType":"дом","inCityDist":"","addressStr":"г. Москва, пр-кт. Елагинский","building1":"","building2":"","houseShortType":"д","building2ShortType":"","apartment":"87"}}',
    },
    fai16: { visited: true, value: '' },
    fai17: { visited: true, value: '' },
    fai19: { visited: true, value: '' },
    ai5i: { visited: true, value: 'Фыв' },
    sn1a: {
      visited: true,
      value:
        '{"birthDate":"19.02.1998","gender":"F","trusted":true,"citizenship":"RUS","snils":"010-000-303 20","biomStu":false,"verifying":false,"oid":"1000305286","exists":true,"age":23}',
    },
    sn2a: { visited: true, value: 'qwe@qwe.qwe' },
    pd6: {
      visited: true,
      value:
        '{"code":"0c5b2444-70a0-4932-980c-b4dc0d3f02b5","address":{"fiasCode":"0c5b2444-70a0-4932-980c-b4dc0d3f02b5","numericFiasCode":null,"fullAddress":"г Москва","postIndex":"101000","elements":[{"level":1,"levelType":null,"fiasCode":"0c5b2444-70a0-4932-980c-b4dc0d3f02b5","elmCode":null,"kladrCode":"7700000000000","oktmoCode":null,"data":"Москва","type":"город","shortType":"г","numericFiasCode":"77-0-000-000-000-000-0000-0000-000"}]},"level":1,"id":"0c5b2444-70a0-4932-980c-b4dc0d3f02b5","text":"г Москва","error":{"code":0,"message":"operation completed"},"dadataQc":"0","dadataQcComplete":"3","dadataQcHouse":"10","unparsedParts":null,"fiasLevel":"1","postalCode":"101000","postalBox":null,"regionKladrId":null,"okato":"45000000000","tax_office":"7700","oktmo":"45000000","geo_lat":"55.7540471","geo_lon":"37.620405","regionCode":"77"}',
    },
  },
  cycledApplicantAnswers: { answerlist: [] },
  participants: {
    1000305286: { role: 'Coapplicant', mode: 'MentionedApplicant', component: 'sn1a' },
  },
  display: {
    id: 's21',
    name: 'Выбор ЗАГС неторжественный',
    type: ScreenTypes.UNIQUE,
    header: 'Выберите ЗАГС',
    submitLabel: 'Выбрать',
    components: [
      {
        id: 'ms2',
        type: 'MapService',
        label: '<p>Выберите ЗАГС</p>',
        attrs: {
          attributeNameWithAddress: 'ADDRESS',
          dictionaryType: 'FNS_ZAGS_ORGANIZATION_AREA',
          dictionaryFilter: [
            {
              attributeName: 'SHOW_ON_MAP',
              condition: DictionaryConditions.EQUALS,
              value: '{"asString":"true"}',
              valueType: 'value',
            },
            {
              attributeName: 'CODE',
              condition: DictionaryConditions.CONTAINS,
              value: 'regCode',
              valueType: 'preset',
            },
            {
              attributeName: 'PR2',
              condition: DictionaryConditions.EQUALS,
              value: '{"asString":"true"}',
              valueType: 'value',
            },
          ],
          selectAttributes: ['ZAGS_NAME', 'ADDRESS', 'PHONE', 'EMAIL', 'GET_CONSENT', 'AREA_DESCR'],
          baloonContent: [
            { name: 'ADDRESS', label: 'Адрес' },
            { name: 'PHONE', label: 'Телефон' },
            { name: 'EMAIL', label: 'Email' },
          ],
          actions: [],
          fields: [{ fieldName: 'regCode', label: '', type: 'hidden' }],
          addressString: { type: 'REF', value: 'pd6.address.fullAddress' },
          value: '',
          visited: false,
          refs: {},
        },
        linkedValues: [],
        arguments: {},
        value:
          '{"address":"г Москва","oktmo":"45000000","geo_lat":"55.7540471","geo_lon":"37.620405","regCode":"R77","fias":"0c5b2444-70a0-4932-980c-b4dc0d3f02b5","okato":"45000000000"}',
        required: true,
      },
    ],
    infoComponents: [],
    terminal: false,
    impasse: false,
    accepted: true,
    firstScreen: false,
  },
  serviceInfo: { statusId: 0 },
  attachmentInfo: {},
  additionalParameters: {},
  generatedFiles: [],
  gender: Gender.male,
};

export const mockSelectMapObjectData = {
  id: 'ms2',
  type: 'MapService',
  label: '<p>Выберите ЗАГС</p>',
  attrs: {
    attributeNameWithAddress: 'ADDRESS',
    dictionaryType: 'FNS_ZAGS_ORGANIZATION_AREA',
    dictionaryFilter: [
      {
        attributeName: 'SHOW_ON_MAP',
        condition: DictionaryConditions.EQUALS,
        value: '{"asString":"true"}',
        valueType: 'value',
      },
      {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'regCode',
        valueType: 'preset',
      },
      {
        attributeName: 'PR2',
        condition: DictionaryConditions.EQUALS,
        value: '{"asString":"true"}',
        valueType: 'value',
      },
    ],
    selectAttributes: ['ZAGS_NAME', 'ADDRESS', 'PHONE', 'EMAIL', 'GET_CONSENT', 'AREA_DESCR'],
    baloonContent: [
      { name: 'ADDRESS', label: 'Адрес' },
      { name: 'PHONE', label: 'Телефон' },
      { name: 'EMAIL', label: 'Email' },
    ],
    actions: [],
    fields: [{ fieldName: 'regCode', label: '', type: 'hidden' }],
    addressString: { type: 'REF', value: 'pd6.address.fullAddress' },
    value: '',
    visited: false,
    refs: {},
  },
  linkedValues: [],
  arguments: {},
  value:
    '{"address":"г Москва","oktmo":"45000000","geo_lat":"55.7540471","geo_lon":"37.620405","regCode":"R77","fias":"0c5b2444-70a0-4932-980c-b4dc0d3f02b5","okato":"45000000000"}',
  required: true,
  valueFromCache: false,
  presetValue:
    '{"address":"г Москва","oktmo":"45000000","geo_lat":"55.7540471","geo_lon":"37.620405","regCode":"R77","fias":"0c5b2444-70a0-4932-980c-b4dc0d3f02b5","okato":"45000000000"}',
};
