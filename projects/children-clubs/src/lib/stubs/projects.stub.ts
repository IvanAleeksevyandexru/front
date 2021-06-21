import { BaseProgram, NSIDictionaryItem, FocusDirectionsItem, Group, Program } from '../typings';

import { DictionaryItem } from '@epgu/epgu-constructor/src/lib/shared/services/dictionary/dictionary-api.types';
import { PaymentInfoInterface } from '@epgu/epgu-constructor/src/lib/component/unique-screen/components/payment/payment.types';

const FinancialSources = [
  {
    code: 'none',
    name: 'Не задан',
  },
  {
    code: 'budget',
    name: 'Бюджетное (бесплатное)',
  },
  {
    code: 'paid',
    name: 'Внебюджетное (платное)',
  },
  {
    code: 'pfdod_certificate',
    name: 'Сертификат ПФДОД',
  },
  {
    code: 'private',
    name: 'Платное (частное)',
  },
] as NSIDictionaryItem[];

const ProgramRegistries = [
  {
    code: 'preprof',
    name: 'Реестр предпрофессиональных программ',
  },
  {
    code: 'valued',
    name: 'Реестр значимых программ',
  },
  {
    code: 'other',
    name: 'Реестр иных программ',
  },
  {
    code: 'certified',
    name: 'Реестр сертифицированных программ',
  },
  {
    code: 'paid',
    name: 'Реестр платных программ',
  },
] as NSIDictionaryItem[];

export const baseProgramStub: BaseProgram = {
  uuid: '23fsdsdfsdf',
  name: 'Ритмика, основы танцевального искусства',
  partnerName: 'МАУ ДО "Центр Гармония',
  address: '141080, Московская область, г. Королёв, проезд Макаренко, дом 4',
  imageUrl:
    'https://new.dop.mosreg.ru/images/events/cover/759b2601181f4245e8794e354047e2ea_big.jpg',
  imageSmallUrl:
    'https://new.dop.mosreg.ru/images/events/cover/c0e6ae1e506fe02da5c492d8b59d707d_244x159.jpg',
  minAge: 6,
  maxAge: 14,
  financingSources: FinancialSources,
  programRegistries: ProgramRegistries,
};

export const programStub: Program = {
  ...baseProgramStub,
  fullName:
    'Дополнительная общеразвивающая программа "Ритмика, основы танцевального искусства" (стартовый уровень)',
  announce:
    'Движения под музыку \u2013 это важнейшее средство развития телесного опыта ребёнка и развития его личности в целом',
  teachers: 'Думчиков Д. В.',
  maxPersons: 15,
  programContent: 'programContent text',
  goal: 'goals text',
  results: 'results text',
  technicalBase: 'technicalBase text',
};

export const focusDirectionsStub: FocusDirectionsItem = {
  focus: 'Социально-гуманитарная',
  directions: [
    'Социально-гуманитарная',
    'Естественнонаучная',
    'Художественная',
    'Физкультурно-спортивная',
    'Туристско-краеведческая',
    'Техническая',
  ],
};

export const groupStub: Group = {
  name: 'Группа 1 П-2 Ритмика П-2',
  ageFrom: 6.0,
  ageTo: 14.0,
  size: '15',
  dateBegin: '2020-10-14',
  dateEnd: '2021-05-31',
  hoursYear: 144.0,
  costHourManual: '123.44',
  teachers: 'Думчиков Д. В.',
  schedule: 'Пн.12:00—14:00; Ср.16:00—17:00;  <br>Пт 17:00—15:30',
  financingSources: [
    {
      sourceCode: 'budget',
      cost: 0,
    },
    {
      sourceCode: 'pfdod_certificate',
      cost: 10000.0,
    },
    {
      sourceCode: 'private',
      cost: 8000.0,
    },
  ],
};

export const regionStub: DictionaryItem = {
  value: 'a478166c-9c75-aaeb-a8b3-0242ac13000a',
  title: 'Государственное бюджетное учреждение дополнительного образования «Центр «Ладога»',
  id: '',
  text: '',
  attributes: [],
  children: [],
  isLeaf: true,
  parentValue: null,
  attributeValues: ({
    uuid: 'a478166c-9c75-aaeb-a8b3-0242ac13000a',
    lastmodifiedTs: '1618331000',
    datasource: '9c05e812-8679-4710-b8cb-5e8bd43cdf48',
    localId: '108528',
    isDeleted: 'false',
    name: 'Ленинградская область',
    fias: '9c05e812-8679-4710-b8cb-5e8bd43cdf48',
    oktmo: '46734000',
    okato: '46434000000',
    site: 'http://р62.навигатор.дети',
    portalTitle: 'Навигатор дополнительного образования Московской области',
    responsible: 'Иванова Есения Валерьевна',
    phone: '+7 (491) 111-11-11',
    email: 'email@mail.ru',
    emailSupport: 'email_support@mail.ru',
    emailClientSupport: 'email_client_support@mail.ru',
    organizationName:
      'Государственное бюджетное учреждение дополнительного образования «Центр «Ладога»',
    ogrn: '1057811208212',
    inn: '4703079940',
    address: {},
    contactPhone: '+7 (812) 200-98-12',
    contactEmail: 'navigator@alsop-service.ru',
    vendor: 'inlearno.com',
  } as unknown) as PaymentInfoInterface & { [key: string]: string },
};
