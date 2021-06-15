import {
  BaseProgram,
  NSIDictionaryItem,
  FocusDirectionsItem,
  Group,
  Program,
  Project,
} from '../typings';
import { Clarifications } from '@epgu/epgu-constructor-types';
import { DictionaryItem } from '@epgu/epgu-constructor/src/lib/shared/services/dictionary/dictionary-api.types';
import { PaymentInfoInterface } from '@epgu/epgu-constructor/src/lib/component/unique-screen/components/payment/payment.types';

const project = {
  name: 'Программа «БиоТех»',
  address: 'Новосибирск, ул. Советская, д. 63',
  teacher: 'Кошелева Ж. А.',
  organization: 'Лицей № 22 «Надежда Сибири» г.Новосибирска',
  description:
    'Программа направлена на формирование культуры экологического и биологического воспитания, изучение современных технологий сферы Биология. ',
  image:
    // eslint-disable-next-line max-len
    'https://stroypark.su/sites/default/files/%D0%9A%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%B0%20POSTERMARKET%20AG%2030-58%20%D0%9C%D0%B8%D0%BB%D1%8B%D0%B9%20%D0%B5%D0%BD%D0%BE%D1%82.jpg',
  schedule: 'Пн.12:00—14:00; Ср.16:00—17:00;  <br>Пт 17:00—15:30',
  period: '01.09.2021 — 31.05.2022',
  paidTrainingPossible: 'Возможно платное обучение',
  freeTrainingPossible: 'Возможно бесплатное обучение',
  PaymentByCertificatePossible: 'Возможна оплата сертификатом',
  groupSize: 'Размер группы до 15 человек',
  ageLimit: '10 - 17 лет',
  distanceLearning: 'Дистанционное обучение',
  budgetProgramOther: 'Бюджетная программа <br>(иная образовательная)',
  budgetProgramPreProf: 'Бюджетная программа <br>(предпрофессиональная)',
  budgetProgramSignificant: 'Бюджетная программа <br>(значимая)',
  additional: '<a id="plan">План занятий</a><br>',
  clarifications: {
    plan: {
      title: 'Цели обучения',
      text: `<p>Программа «БиоТех»</p>
          <p>Формирование у школьников биологической и экологической культуры</p>
          <p>Метапредметная: развитие навыков экспериментальной работы</p>
          <p>Личностная: Формирование экологически грамотного жителя планеты Земля</p>
          <p>Предметная: освоение основных понятий современных биотехнологий, формирование навыков проведения биологического исследования </p>
`,
    },
  } as Clarifications,
};

export default [
  { ...project },
  { ...project },
  { ...project },
  { ...project },
  { ...project },
  { ...project },
  { ...project },
  { ...project },
  { ...project },
  { ...project },
  { ...project },
  { ...project },
  { ...project },
  { ...project },
  { ...project },
  { ...project },
  { ...project },
  { ...project },
  { ...project },
] as Project[];

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

const INFO = {
  package: {
    dictionaries: {
      PartnerTypes: {
        item: [
          {
            code: 'none',
            name: 'Не указан',
          },
          {
            code: 'additional',
            name: 'Организация дополнительного образования',
          },
          {
            code: 'preschool',
            name: 'Дошкольная образовательная организация',
          },
          {
            code: 'general',
            name: 'Общеобразовательная организация',
          },
          {
            code: 'professional',
            name: 'Профессиональная образовательная организация',
          },
          {
            code: 'high',
            name: 'Образовательная организация высшего образования',
          },
          {
            code: 'additional_professional',
            name: 'Организация дополнительного профессионального образования',
          },
          {
            code: 'atypical',
            name: 'Нетиповая образовательная организация',
          },
          {
            code: 'sport',
            name: 'Организация, осуществляющая спортивную подготовку',
          },
        ],
      },
      Departments: {
        item: [
          {
            code: 'educations ',
            name: 'Орган власти, осуществляющий управление в сфере образования и науки',
          },
          {
            code: 'socials',
            name: 'Орган власти, осуществляющий управление в сфере социального развития',
          },
          {
            code: 'cultures',
            name: 'Орган власти, осуществляющий управление в сфере культуры',
          },
          {
            code: 'sports',
            name: 'Орган власти, осуществляющий управление в сфере физической культуры и спорта',
          },
          {
            code: 'politics',
            name: 'Орган власти, осуществляющий управление в сфере молодежной политики',
          },
          {
            code: 'others',
            name: 'Прочие',
          },
          {
            code: 'none',
            name: 'Нет',
          },
        ],
      },
      ProgramLevels: {
        item: [
          {
            code: 'initial',
            name: 'Стартовый (ознакомительный)',
          },
          {
            code: 'basic',
            name: 'Базовый',
          },
          {
            code: 'advanced',
            name: 'Продвинутый (углубленный)',
          },
        ],
      },
      ProgramRegistries: {
        item: [
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
        ],
      },
      OvzTypes: {
        item: [
          {
            code: 'deafness',
            name: 'Глухие',
          },
          {
            code: 'hearing_impairment',
            name: 'Слабослышащие и позднооглохшие',
          },
          {
            code: 'blindness',
            name: 'Слепые',
          },
          {
            code: 'visual_impairment',
            name: 'Слабовидящие',
          },
          {
            code: 'speech_impairment',
            name: 'Нарушение речи',
          },
          {
            code: 'mental_impairment',
            name: 'Задержка психического развития',
          },
          {
            code: 'authism',
            name: 'Расстройство аутического спектра',
          },
          {
            code: 'intellectual_disability',
            name: 'Нарушение интеллекта',
          },
        ],
      },
      ProgramTypes: {
        item: [
          {
            code: 'general',
            name: 'Общеразвивающая',
          },
          {
            code: 'preprof',
            name: 'Предпрофессиональная',
          },
          {
            code: 'sport',
            name: 'Спортивная подготовка',
          },
        ],
      },
      ProgramStates: {
        item: [
          {
            code: 'initial',
            name: 'Черновик',
          },
          {
            code: 'archive',
            name: 'Архив',
          },
          {
            code: 'moderating',
            name: 'Модерация',
          },
          {
            code: 'published',
            name: 'Опубликовано',
          },
          {
            code: 'wait_for_editing',
            name: 'Ожидает правки',
          },
        ],
      },
      ProgramFocuses: {
        item: [
          {
            code: 'socialno-pedagogicheskoe',
            name: 'Социально-гуманитарная',
          },
          {
            code: 'estestvennonauchnoe',
            name: 'Естественнонаучная',
          },
          {
            code: 'hudozhestvennoe',
            name: 'Художественная',
          },
          {
            code: 'fizkulturno-sportivnoe',
            name: 'Физкультурно-спортивная',
          },
          {
            code: 'turistsko-kraevedcheskoe',
            name: 'Туристско-краеведческая',
          },
          {
            code: 'tekhnicheskoe',
            name: 'Техническая',
          },
        ],
      },
      FinancialSources: {
        item: [
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
        ],
      },
    },
    objects: {
      regions: {
        region: {
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
        },
      },
      partners: {
        partner: [
          {
            uuid: 'a478166c-9c75-11eb-a8b3-0242ac130001',
            lastmodifiedTs: '1618331000',
            datasource: '9c05e812-8679-4710-b8cb-5e8bd43cdf48',
            localId: '125',
            isDeleted: 'false',
            publicName: 'МАУ ДО "Центр Гармония"',
            shortName: 'МАУ ДО "Центр Гармония"',
            typeOrg: 'additional',
            departmentCode: 'educations',
            actualAddress: '141080, Московская область, г. Королёв, проезд Макаренко, дом 4',
            address: '141080, Московская область, г. Королёв, проезд Макаренко, дом 4',
            phone: '4986573255',
            site: 'http://centergarmoniya.ru',
            email: 'garmoniya.center@yandex.ru',
            fiasRegion: '9c05e812-8679-4710-b8cb-5e8bd43cdf48',
            oktmo: '46734000',
            okato: '46434000000',
            ogrn: '1025002025806',
          },
          {
            uuid: 'a478166c-9c75-11eb-a8b3-0242ac130002',
            lastmodifiedTs: '1618331002',
            datasource: '9c05e812-8679-4710-b8cb-5e8bd43cdf48',
            localId: '147',
            isDeleted: 'false',
            publicName:
              'Муниципальное учреждение дополнительного образования «Дом детского творчества»',
            shortName: 'МУ "ДДТ"',
            typeOrg: 'general',
            departmentCode: 'cultures',
            actualAddress:
              '143800, Московская область, Лотошинский район, пос. Лотошино, ул. Заводская, д. 13',
            address:
              '143800, Московская область, Лотошинский район, пос. Лотошино, ул. Заводская, д. 13',
            phone: '+7 (495) 548-01-91,+7 (498) 657-28-61',
            site: 'http://цдо-чемпион.рф/',
            email: 'email@bk.ru',
            fiasRegion: '9c05e812-8679-4710-b8cb-5e8bd43cdf48',
            oktmo: {},
            okato: '46230501000',
            ogrn: '1025007390210',
          },
        ],
      },
      programs: {
        program: [
          {
            uuid: 'b478166c-9c75-11eb-a8b3-0242ac130001',
            lastmodifiedTs: '1618331011',
            datasource: '9c05e812-8679-4710-b8cb-5e8bd43cdf48',
            localId: '65638',
            isDeleted: 'false',
            partnerUuid: 'a478166c-9c75-11eb-a8b3-0242ac130001',
            name: 'Ритмика, основы танцевального искусства',
            fullName:
              'Дополнительная общеразвивающая программа "Ритмика, основы танцевального искусства" (стартовый уровень)',
            announce:
              'Движения под музыку \u2013 это важнейшее средство развития телесного опыта ребёнка и развития его личности в целом',
            dateCreate: '2020-10-18T13:44:44',
            dateChanged: '2020-10-20T10:35:57',
            duration: '1',
            durationunit: 'year',
            location: 'Московская область, г. Королев, ул. Исаева д. 2/30',
            minPersons: '1',
            maxPersons: '15',
            minAge: '6',
            maxAge: '14',
            levelSet: 'basic',
            ovz: 'false',
            ovzTypes: {},
            programRegistries: {},
            certificateRequired: {},
            invalidAdapted: 'false',
            programType: 'general',
            state: 'published',
            fiasMunicipal: '819d6910-b4d1-474f-ad10-c1fa944dfca4',
            okato: '46230501000',
            oktmo: {},
            imageUrl:
              'https://new.dop.mosreg.ru/images/events/cover/759b2601181f4245e8794e354047e2ea_big.jpg',
            imageSmallUrl:
              'https://new.dop.mosreg.ru/images/events/cover/c0e6ae1e506fe02da5c492d8b59d707d_244x159.jpg',
            focusCode: 'fizkulturno-sportivnoe',
            directionUuid: '73629a40-9c75-11eb-a8b3-0242ac130001',
            reviewsAvg: 'reviewsAvg text',
            detailDescription: 'detailDescription text',
            programContent: 'programContent text',
            goals: 'goals text',
            results: 'results text',
            technicalBase: 'technicalBase text',
          },
          {
            uuid: 'b1f76936-9c75-11eb-a8b3-0242ac130003',
            lastmodifiedTs: '1618331014',
            datasource: '9c05e812-8679-4710-b8cb-5e8bd43cdf48',
            localId: '65785',
            isDeleted: 'false',
            partnerUuid: 'a478166c-9c75-11eb-a8b3-0242ac130001',
            name: 'Робототехника',
            fullName: {},
            announce:
              'Робототехника \u2013это междисциплинарные занятия, интегрирующие в себе науку,технологию,инженерное дело, математику.',
            dateCreate: '2020-10-25T20:20:06',
            dateChanged: '2020-11-13T23:14:36',
            duration: '6',
            durationunit: 'month',
            location:
              '143530, Московская область, Истринский район, г. Дедовск, ул. Энергетиков, д. 15',
            minPersons: '1',
            maxPersons: '10',
            minAge: '6.0',
            maxAge: '13.0',
            levelSet: ['basic', 'advanced'],
            ovz: 'true',
            ovzTypes: ['deafness', 'hearing_impairment', 'musculoskeletal_disorders', 'authism'],
            programRegistries: ['preprof', 'valued', 'other'],
            certificateRequired: 'true',
            invalidAdapted: 'true',
            programType: 'preprof',
            state: 'wait_for_editing',
            fiasMunicipal: '819d6910-b4d1-474f-ad10-c1fa944dfca4',
            okato: '46229551000',
            oktmo: '46752000',
            imageUrl:
              'https://new.dop.mosreg.ru/images/events/cover/4ffa41c017d6ca632cb4a224d6ee7b3a_big.jpg',
            imageSmallUrl:
              'https://new.dop.mosreg.ru/images/events/cover/4ffa41c017d6ca632cb4a224d6ee7b3a_244x159.jpg',
            focusCode: 'estestvennonauchnoe',
            directionUuid: '73629a40-9c75-11eb-a8b3-0242ac130002',
            reviewsAvg: 'reviewsAvg text',
            detailDescription: 'detailDescription text',
            programContent: 'programContent text',
            goals: 'goals text',
            results: 'results text',
            technicalBase: 'technicalBase text',
          },
        ],
      },
      groups: {
        group: [
          {
            uuid: 'cdc777d8-9c75-11eb-a8b3-0242ac130001',
            lastmodifiedTs: '1618331015',
            datasource: '9c05e812-8679-4710-b8cb-5e8bd43cdf48',
            localId: '190069',
            isDeleted: 'false',
            programUuid: 'b478166c-9c75-11eb-a8b3-0242ac130001',
            name: 'Группа 1 П-2 Ритмика П-2',
            typeGroup: 'group',
            ageFrom: '6.0',
            ageTo: '14.0',
            sizeMin: '1',
            size: '15',
            isPfdod: 'false',
            dateBegin: '2020-10-14',
            dateEnd: '2021-05-31',
            isLocked: 'false',
            orderFrom: {},
            orderTo: {},
            isLockedNextYear: 'true',
            availableNextYearOrderFrom: {},
            availableNextYearOrderTo: {},
            hoursYear: '144.00',
            financingSources: {
              source: 'paid',
              cost: '1234.56',
            },
            costHourManual: {},
            dataTeachers: 'Думчиков Д. В.',
            fiasMunicipal: '819d6910-b4d1-474f-ad10-c1fa944dfca4',
            okato: '46229551000',
            oktmo: '46752000',
          },
          {
            uuid: 'ca129a18-9c75-11eb-a8b3-0242ac130002',
            lastmodifiedTs: '1618331009',
            datasource: '9c05e812-8679-4710-b8cb-5e8bd43cdf48',
            localId: '190690',
            isDeleted: 'false',
            programUuid: 'b478166c-9c75-11eb-a8b3-0242ac130001',
            name: 'Группа 4 П-2 Ритмика',
            typeGroup: 'group',
            ageFrom: '12.0',
            ageTo: '14.0',
            sizeMin: '1',
            size: '5',
            isPfdod: 'true',
            dateBegin: '2020-10-14',
            dateEnd: '2021-05-31',
            isLocked: 'false',
            orderFrom: '2020-10-14',
            orderTo: '2020-12-30',
            isLockedNextYear: 'false',
            availableNextYearOrderFrom: '2021-04-15',
            availableNextYearOrderTo: '2022-08-31',
            hoursYear: '216.00',
            financingSources: [
              {
                source: 'budget',
                cost: {},
              },
              {
                source: 'pfdod_certificate',
                cost: '10000.00',
              },
              {
                source: 'private',
                cost: '8000.00',
              },
            ],
            costHourManual: '123.44',
            dataTeachers: 'Думчиков Д. В.',
            fiasMunicipal: '819d6910-b4d1-474f-ad10-c1fa944dfca4',
            okato: '46229551000',
            oktmo: '46752000',
          },
        ],
      },
      schedules: {
        schedule: [
          {
            uuid: 'da129a18-9c75-11eb-a8b3-0242ac130001',
            lastmodifiedTs: '1618331011',
            datasource: '9c05e812-8679-4710-b8cb-5e8bd43cdf48',
            localId: '11',
            isDeleted: 'false',
            groupUuid: 'cdc777d8-9c75-11eb-a8b3-0242ac130001',
            periodFrom: '2020-09-01',
            periodTo: '2021-05-31',
            weekDays: ['mon', 'wed', 'fri'],
            timeStart: '9:00',
            timeEnd: '12:30',
            duration: '4',
            durationLength: '45',
            breaks: ['10', '10', '10'],
          },
          {
            uuid: 'da129a18-9c75-11eb-a8b3-0242ac130002',
            lastmodifiedTs: '1618331011',
            datasource: '9c05e812-8679-4710-b8cb-5e8bd43cdf48',
            localId: '12',
            isDeleted: 'false',
            groupUuid: 'cdc777d8-9c75-11eb-a8b3-0242ac130001',
            periodFrom: '2020-09-20',
            periodTo: '2021-05-31',
            weekDays: 'sun',
            timeStart: '12:00',
            timeEnd: '12:45',
            duration: '1',
            durationLength: '45',
            breaks: {},
          },
        ],
      },
      programDirections: {
        programDirection: [
          {
            uuid: '73629a40-9c75-11eb-a8b3-0242ac130001',
            lastmodifiedTs: '1618331012',
            datasource: '9c05e812-8679-4710-b8cb-5e8bd43cdf48',
            localId: '55',
            isDeleted: 'false',
            focusCode: 'hudozhestvennoe',
            name: 'Спортивная хореография',
            sortOrder: '2',
            significant: 'true',
          },
          {
            uuid: '73629a40-11eb-9c75-a8b3-0242ac130002',
            lastmodifiedTs: '1618331013',
            datasource: '9c05e812-8679-4710-b8cb-5e8bd43cdf48',
            localId: '56',
            isDeleted: 'false',
            focusCode: 'hudozhestvennoe',
            name: 'Хореография',
            sortOrder: '5',
            significant: 'false',
          },
        ],
      },
    },
  },
};
