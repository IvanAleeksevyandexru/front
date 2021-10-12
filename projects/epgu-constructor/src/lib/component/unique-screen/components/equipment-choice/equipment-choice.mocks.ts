import { ComponentBase } from '../../../../screen/screen.types';
import { EquipmentChoiceCategory, EquipmentFormValue } from './equipment-choice.types';

export const equipmentChoiceComponentMock: ComponentBase = {
  id: 'test1',
  type: 'EquipmentChoice',
  label: 'Оборудование',
  attrs: {
    equipmentFilters: [],
    result: {
      items: [
        {
          value: '47',
          title: 'автомобиль',
          attributeValues: {
            ID: 47,
            EQUIPMENT_NAME: 'автомобиль',
            IS_OWNERSHIP_FORM_REQUIRED: 'false',
            IS_FACTORY_NUMBER_REQUIRED: 'false',
            IS_REG_NUMBER_REQUIRED: 'true',
            CATEGORY_ID: 15,
            REQUIRED_FOR_SERVICE: 1468400,
            LIC_DEPARTMENT_OGRN: 1047796244396,
            autokey: 'CONC_EQUIPMENT_NAME_RZ_47_1047796244396',
            IS_FACTORY_NUMBER_OPTIONAL: 'false',
            IS_REG_NUMBER_OPTIONAL: 'false',
            MIN_AMOUNT_EQUIPMENT: null,
            CATEGORY_NAME: 'Оборудование для перевозки',
          },
        },
        {
          value: '10',
          title: 'вентиляционная система',
          attributeValues: {
            ID: 10,
            EQUIPMENT_NAME: 'вентиляционная система',
            IS_OWNERSHIP_FORM_REQUIRED: 'false',
            IS_FACTORY_NUMBER_REQUIRED: 'false',
            IS_REG_NUMBER_REQUIRED: 'false',
            CATEGORY_ID: 2,
            REQUIRED_FOR_SERVICE: 14681,
            LIC_DEPARTMENT_OGRN: '1047796244396',
            autokey: 'CONC_EQUIPMENT_NAME_RZ_10_1047796244396',
            IS_FACTORY_NUMBER_OPTIONAL: 'false',
            IS_REG_NUMBER_OPTIONAL: 'false',
            MIN_AMOUNT_EQUIPMENT: null,
            CATEGORY_NAME:
              'Оборудование для поддержания определенной температуры и влажности воздуха',
          },
        },
        {
          value: '8',
          title: 'воздушные завесы без подогрева/охлаждения воздуха',
          attributeValues: {
            ID: 8,
            EQUIPMENT_NAME: 'воздушные завесы без подогрева/охлаждения воздуха',
            IS_OWNERSHIP_FORM_REQUIRED: 'false',
            IS_FACTORY_NUMBER_REQUIRED: 'false',
            IS_REG_NUMBER_REQUIRED: 'false',
            CATEGORY_ID: 1,
            REQUIRED_FOR_SERVICE: 14681,
            LIC_DEPARTMENT_OGRN: '1047796244396',
            autokey: 'CONC_EQUIPMENT_NAME_RZ_8_1047796244396',
            IS_FACTORY_NUMBER_OPTIONAL: false,
            IS_REG_NUMBER_OPTIONAL: false,
            MIN_AMOUNT_EQUIPMENT: null,
            CATEGORY_NAME: 'Оборудование для защиты от воздействия погодных условий',
          },
        },
        {
          value: '3',
          title: 'ворота секционные',
          attributeValues: {
            ID: 3,
            EQUIPMENT_NAME: 'ворота секционные',
            IS_OWNERSHIP_FORM_REQUIRED: 'false',
            IS_FACTORY_NUMBER_REQUIRED: 'false',
            IS_REG_NUMBER_REQUIRED: 'false',
            CATEGORY_ID: 1,
            REQUIRED_FOR_SERVICE: 14681,
            LIC_DEPARTMENT_OGRN: '1047796244396',
            autokey: 'CONC_EQUIPMENT_NAME_RZ_3_1047796244396',
            IS_FACTORY_NUMBER_OPTIONAL: 'false',
            IS_REG_NUMBER_OPTIONAL: 'false',
            MIN_AMOUNT_EQUIPMENT: null,
            CATEGORY_NAME: 'Оборудование для защиты от воздействия погодных условий',
          },
        },
        {
          value: '1',
          title: 'ворота секционные подъемные с электроприводом',
          attributeValues: {
            ID: 1,
            EQUIPMENT_NAME: 'ворота секционные подъемные с электроприводом',
            IS_OWNERSHIP_FORM_REQUIRED: 'false',
            IS_FACTORY_NUMBER_REQUIRED: 'false',
            IS_REG_NUMBER_REQUIRED: 'false',
            CATEGORY_ID: 1,
            REQUIRED_FOR_SERVICE: 14681,
            LIC_DEPARTMENT_OGRN: '1047796244396',
            autokey: 'CONC_EQUIPMENT_NAME_RZ_1_1047796244396',
            IS_FACTORY_NUMBER_OPTIONAL: 'false',
            IS_REG_NUMBER_OPTIONAL: 'false',
            MIN_AMOUNT_EQUIPMENT: null,
            CATEGORY_NAME: 'Оборудование для защиты от воздействия погодных условий',
          },
        },
        {
          value: '19',
          title: 'гигрометр (электронный гигрометр) или психрометр',
          attributeValues: {
            ID: 19,
            EQUIPMENT_NAME: 'гигрометр (электронный гигрометр) или психрометр',
            IS_OWNERSHIP_FORM_REQUIRED: 'false',
            IS_FACTORY_NUMBER_REQUIRED: 'false',
            IS_REG_NUMBER_REQUIRED: 'false',
            CATEGORY_ID: 3,
            REQUIRED_FOR_SERVICE: 14683,
            LIC_DEPARTMENT_OGRN: '1047796244396',
            autokey: 'CONC_EQUIPMENT_NAME_RZ_19_1047796244396',
            IS_FACTORY_NUMBER_OPTIONAL: 'false',
            IS_REG_NUMBER_OPTIONAL: 'false',
            MIN_AMOUNT_EQUIPMENT: null,
            CATEGORY_NAME:
              'Оборудование (средства измерений) для контроля или мониторинга условий хранения лекарственных средств',
          },
        },
        {
          value: '4',
          title: 'доклевеллер (перегрузочный мост)',
          attributeValues: {
            ID: 4,
            EQUIPMENT_NAME: 'доклевеллер (перегрузочный мост)',
            IS_OWNERSHIP_FORM_REQUIRED: 'false',
            IS_FACTORY_NUMBER_REQUIRED: 'false',
            IS_REG_NUMBER_REQUIRED: 'false',
            CATEGORY_ID: 1,
            REQUIRED_FOR_SERVICE: 14683,
            LIC_DEPARTMENT_OGRN: '1047796244396',
            autokey: 'CONC_EQUIPMENT_NAME_RZ_4_1047796244396',
            IS_FACTORY_NUMBER_OPTIONAL: 'false',
            IS_REG_NUMBER_OPTIONAL: 'false',
            MIN_AMOUNT_EQUIPMENT: null,
            CATEGORY_NAME: 'Оборудование для защиты от воздействия погодных условий',
          },
        },
      ],
      attrs: {
        CONC_SERVICE_TYPE_IDS: ['14688', '14687', '14685', '14686', '14683'],
      },
    },
  },
  arguments: {},
  value: '',
  required: true,
};

export const itemsWithMinAmountMock: ComponentBase = {
  id: 'test2',
  type: 'EquipmentChoice',
  label: 'Оборудование c минимальным количеством',
  attrs: {
    result: {
      items: [
        {
          value: '47',
          title: 'автомобиль',
          attributeValues: {
            ID: 47,
            EQUIPMENT_NAME: 'автомобиль',
            IS_OWNERSHIP_FORM_REQUIRED: 'false',
            IS_FACTORY_NUMBER_REQUIRED: 'false',
            IS_REG_NUMBER_REQUIRED: 'true',
            CATEGORY_ID: 15,
            REQUIRED_FOR_SERVICE: 1468400,
            LIC_DEPARTMENT_OGRN: 1047796244396,
            autokey: 'CONC_EQUIPMENT_NAME_RZ_47_1047796244396',
            IS_FACTORY_NUMBER_OPTIONAL: 'false',
            IS_REG_NUMBER_OPTIONAL: 'false',
            MIN_AMOUNT_EQUIPMENT: 2,
            CATEGORY_NAME: 'Оборудование для перевозки',
          },
        },
        {
          value: '46',
          title: 'грузовик',
          attributeValues: {
            ID: 46,
            EQUIPMENT_NAME: 'грузовик',
            IS_OWNERSHIP_FORM_REQUIRED: 'false',
            IS_FACTORY_NUMBER_REQUIRED: 'false',
            IS_REG_NUMBER_REQUIRED: 'true',
            CATEGORY_ID: 15,
            REQUIRED_FOR_SERVICE: 1468400,
            LIC_DEPARTMENT_OGRN: 1047796244396,
            autokey: 'CONC_EQUIPMENT_NAME_RZ_47_1047796244396',
            IS_FACTORY_NUMBER_OPTIONAL: 'false',
            IS_REG_NUMBER_OPTIONAL: 'false',
            MIN_AMOUNT_EQUIPMENT: 2,
            CATEGORY_NAME: 'Оборудование для перевозки',
          },
        },
      ],
    },
  },
  arguments: {},
  value: '',
  required: true,
};

export const formValueMock: EquipmentFormValue = {
  1: {
    equipment: {
      list: [
        {
          id: '4',
          originalItem: {
            value: '4',
            title: 'доклевеллер (перегрузочный мост)',
            attributeValues: {
              ID: 4,
              EQUIPMENT_NAME: 'доклевеллер (перегрузочный мост)',
              IS_OWNERSHIP_FORM_REQUIRED: 'false',
              IS_FACTORY_NUMBER_REQUIRED: 'false',
              IS_REG_NUMBER_REQUIRED: 'false',
              CATEGORY_ID: 1,
              REQUIRED_FOR_SERVICE: 14683,
              LIC_DEPARTMENT_OGRN: '1047796244396',
              autokey: 'CONC_EQUIPMENT_NAME_RZ_4_1047796244396',
              IS_FACTORY_NUMBER_OPTIONAL: 'false',
              IS_REG_NUMBER_OPTIONAL: 'false',
              MIN_AMOUNT_EQUIPMENT: null,
              CATEGORY_NAME: 'Оборудование для защиты от воздействия погодных условий',
            },
          },
          text: 'доклевеллер (перегрузочный мост)',
          unselectable: true,
        },
      ],
      amount: 1,
    },
  },
  2: {
    equipment: null,
  },
  3: {
    equipment: {
      list: [
        {
          id: '19',
          originalItem: {
            value: '19',
            title: 'гигрометр (электронный гигрометр) или психрометр',
            attributeValues: {
              ID: 19,
              EQUIPMENT_NAME: 'гигрометр (электронный гигрометр) или психрометр',
              IS_OWNERSHIP_FORM_REQUIRED: 'false',
              IS_FACTORY_NUMBER_REQUIRED: 'false',
              IS_REG_NUMBER_REQUIRED: 'false',
              CATEGORY_ID: 3,
              REQUIRED_FOR_SERVICE: 14683,
              LIC_DEPARTMENT_OGRN: '1047796244396',
              autokey: 'CONC_EQUIPMENT_NAME_RZ_19_1047796244396',
              IS_FACTORY_NUMBER_OPTIONAL: 'false',
              IS_REG_NUMBER_OPTIONAL: 'false',
              MIN_AMOUNT_EQUIPMENT: null,
              CATEGORY_NAME:
                'Оборудование (средства измерений) для контроля или мониторинга условий хранения лекарственных средств',
            },
          },
          text: 'гигрометр (электронный гигрометр) или психрометр',
          unselectable: true,
        },
      ],
      amount: 1,
    },
  },
  15: {
    equipment: {
      list: [
        {
          id: '47',
          text: 'автомобиль',
          unselectable: false,
          originalItem: {
            value: '47',
            title: 'автомобиль',
            attributeValues: {
              ID: 47,
              EQUIPMENT_NAME: 'автомобиль',
              IS_OWNERSHIP_FORM_REQUIRED: 'false',
              IS_FACTORY_NUMBER_REQUIRED: 'false',
              IS_REG_NUMBER_REQUIRED: 'true',
              CATEGORY_ID: 15,
              REQUIRED_FOR_SERVICE: 1468400,
              LIC_DEPARTMENT_OGRN: 1047796244396,
              autokey: 'CONC_EQUIPMENT_NAME_RZ_47_1047796244396',
              IS_FACTORY_NUMBER_OPTIONAL: 'false',
              IS_REG_NUMBER_OPTIONAL: 'false',
              MIN_AMOUNT_EQUIPMENT: null,
              CATEGORY_NAME: 'Оборудование для перевозки',
            },
            props: {
              regNumber: 'wq32456',
            },
          },
        },
      ],
      amount: 1,
    },
  },
};

export const equipmentCategoryMock: EquipmentChoiceCategory = {
  id: 15,
  name: 'Оборудование для перевозки',
  equipment: [
    {
      value: '47',
      title: 'автомобиль',
      attributeValues: {
        ID: 47,
        EQUIPMENT_NAME: 'автомобиль',
        IS_OWNERSHIP_FORM_REQUIRED: 'false',
        IS_FACTORY_NUMBER_REQUIRED: 'false',
        IS_REG_NUMBER_REQUIRED: 'true',
        CATEGORY_ID: 15,
        REQUIRED_FOR_SERVICE: 1468400,
        LIC_DEPARTMENT_OGRN: 1047796244396,
        autokey: 'CONC_EQUIPMENT_NAME_RZ_47_1047796244396',
        IS_FACTORY_NUMBER_OPTIONAL: 'false',
        IS_REG_NUMBER_OPTIONAL: 'false',
        MIN_AMOUNT_EQUIPMENT: 2,
        CATEGORY_NAME: 'Оборудование для перевозки',
      },
    },
    {
      value: '46',
      title: 'грузовик',
      attributeValues: {
        ID: 46,
        EQUIPMENT_NAME: 'грузовик',
        IS_OWNERSHIP_FORM_REQUIRED: 'false',
        IS_FACTORY_NUMBER_REQUIRED: 'false',
        IS_REG_NUMBER_REQUIRED: 'true',
        CATEGORY_ID: 15,
        REQUIRED_FOR_SERVICE: 1468400,
        LIC_DEPARTMENT_OGRN: 1047796244396,
        autokey: 'CONC_EQUIPMENT_NAME_RZ_47_1047796244396',
        IS_FACTORY_NUMBER_OPTIONAL: 'false',
        IS_REG_NUMBER_OPTIONAL: 'false',
        MIN_AMOUNT_EQUIPMENT: 2,
        CATEGORY_NAME: 'Оборудование для перевозки',
      },
    },
  ],
  minAmount: null,
};

export const categoryFormTestValue = {
  46: {
    regNumber: null,
  },
  47: {
    regNumber: null,
  },
  equipment: {
    list: [
      {
        id: '47',
        originalItem: {
          value: '47',
          title: 'автомобиль',
          attributeValues: {
            ID: 47,
            EQUIPMENT_NAME: 'автомобиль',
            IS_OWNERSHIP_FORM_REQUIRED: 'false',
            IS_FACTORY_NUMBER_REQUIRED: 'false',
            IS_REG_NUMBER_REQUIRED: 'true',
            CATEGORY_ID: 15,
            REQUIRED_FOR_SERVICE: 1468400,
            LIC_DEPARTMENT_OGRN: 1047796244396,
            autokey: 'CONC_EQUIPMENT_NAME_RZ_47_1047796244396',
            IS_FACTORY_NUMBER_OPTIONAL: 'false',
            IS_REG_NUMBER_OPTIONAL: 'false',
            MIN_AMOUNT_EQUIPMENT: 2,
            CATEGORY_NAME: 'Оборудование для перевозки',
          },
        },
        text: 'автомобиль',
        unselectable: true,
      },
      {
        id: '46',
        originalItem: {
          value: '46',
          title: 'грузовик',
          attributeValues: {
            ID: 46,
            EQUIPMENT_NAME: 'грузовик',
            IS_OWNERSHIP_FORM_REQUIRED: 'false',
            IS_FACTORY_NUMBER_REQUIRED: 'false',
            IS_REG_NUMBER_REQUIRED: 'true',
            CATEGORY_ID: 15,
            REQUIRED_FOR_SERVICE: 1468400,
            LIC_DEPARTMENT_OGRN: 1047796244396,
            autokey: 'CONC_EQUIPMENT_NAME_RZ_47_1047796244396',
            IS_FACTORY_NUMBER_OPTIONAL: 'false',
            IS_REG_NUMBER_OPTIONAL: 'false',
            MIN_AMOUNT_EQUIPMENT: 2,
            CATEGORY_NAME: 'Оборудование для перевозки',
          },
        },
        text: 'грузовик',
        unselectable: true,
      },
    ],
    amount: 2,
  },
};

export const cachedValueMock =
  // eslint-disable-next-line max-len
  '{"categories":[{"id":"1","list":[{"id":"4","originalItem":{"value":"4","title":"доклевеллер (перегрузочный мост)","attributeValues":{"ID":4,"EQUIPMENT_NAME":"доклевеллер (перегрузочный мост)","IS_OWNERSHIP_FORM_REQUIRED":"false","IS_FACTORY_NUMBER_REQUIRED":"false","IS_REG_NUMBER_REQUIRED":"false","CATEGORY_ID":1,"REQUIRED_FOR_SERVICE":14683,"LIC_DEPARTMENT_OGRN":"1047796244396","autokey":"CONC_EQUIPMENT_NAME_RZ_4_1047796244396","IS_FACTORY_NUMBER_OPTIONAL":"false","IS_REG_NUMBER_OPTIONAL":"false","MIN_AMOUNT_EQUIPMENT":null,"CATEGORY_NAME":"Оборудование для защиты от воздействия погодных условий"}},"text":"доклевеллер (перегрузочный мост)","unselectable":true}],"amount":1},{"id":"2","list":[],"amount":0},{"id":"3","list":[{"id":"19","originalItem":{"value":"19","title":"гигрометр (электронный гигрометр) или психрометр","attributeValues":{"ID":19,"EQUIPMENT_NAME":"гигрометр (электронный гигрометр) или психрометр","IS_OWNERSHIP_FORM_REQUIRED":"false","IS_FACTORY_NUMBER_REQUIRED":"false","IS_REG_NUMBER_REQUIRED":"false","CATEGORY_ID":3,"REQUIRED_FOR_SERVICE":14683,"LIC_DEPARTMENT_OGRN":"1047796244396","autokey":"CONC_EQUIPMENT_NAME_RZ_19_1047796244396","IS_FACTORY_NUMBER_OPTIONAL":"false","IS_REG_NUMBER_OPTIONAL":"false","MIN_AMOUNT_EQUIPMENT":null,"CATEGORY_NAME":"Оборудование (средства измерений) для контроля или мониторинга условий хранения лекарственных средств"}},"text":"гигрометр (электронный гигрометр) или психрометр","unselectable":true}],"amount":1},{"id":"15","list":[{"id":"47","text":"автомобиль","unselectable":false,"originalItem":{"value":"47","title":"автомобиль","attributeValues":{"ID":47,"EQUIPMENT_NAME":"автомобиль","IS_OWNERSHIP_FORM_REQUIRED":"false","IS_FACTORY_NUMBER_REQUIRED":"false","IS_REG_NUMBER_REQUIRED":"true","CATEGORY_ID":15,"REQUIRED_FOR_SERVICE":1468400,"LIC_DEPARTMENT_OGRN":1047796244396,"autokey":"CONC_EQUIPMENT_NAME_RZ_47_1047796244396","IS_FACTORY_NUMBER_OPTIONAL":"false","IS_REG_NUMBER_OPTIONAL":"false","MIN_AMOUNT_EQUIPMENT":null,"CATEGORY_NAME":"Оборудование для перевозки"},"props":{"regNumber":"wq32456"}}}],"amount":1}],"amount":4}';
