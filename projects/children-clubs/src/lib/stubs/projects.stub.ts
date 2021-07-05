import {
  BaseProgram,
  EducationType,
  FinancialSourceType,
  FinancingType,
  FocusDirectionsItem,
  Group,
  Program,
  TypeOfBudget,
} from '../typings';

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
  financingTypes: [FinancingType.free, FinancingType.paid, FinancingType.certificate],
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
  goals: 'goals text',
  results: 'results text',
  technicalBase: 'technicalBase text',
  educationForm: EducationType.distance,
  groupCount: 6,
  financingTypes: [
    FinancingType.free,
    FinancingType.paid,
    FinancingType.certificate,
    FinancingType.other,
    FinancingType.preprof,
    FinancingType.valued,
  ],
  typeOfBudget: TypeOfBudget.valued,
  region: { uuid: 'sdfsdf', name: 'sdfsdf' },
  municipal: { uuid: 'sdfsdf', name: 'sdfsdf' },
  datasource: 'sdfsdf',
};

export const focusDirectionsStubList: FocusDirectionsItem[] = [
  {
    focusName: 'Социально-гуманитарная',
    focusCode: 'socialno_gumanitarnoe',
    directions: [
      'Социально-гуманитарная',
      'Общеразвивающая',
      'Предпрофессиональная',
      'Спортивная подготовка',
    ],
  },
  {
    focusName: 'Естественнонаучная',
    focusCode: 'estestvennonauchnoe',
    directions: [
      'Естественнонаучная',
      'Общеразвивающая',
      'Предпрофессиональная',
      'Спортивная подготовка',
    ],
  },
  {
    focusName: 'Художественная',
    focusCode: 'hudozhestvennoe',
    directions: [
      'Художественная',
      'Общеразвивающая',
      'Предпрофессиональная',
      'Спортивная подготовка',
    ],
  },
  {
    focusName: 'Физкультурно-спортивная',
    focusCode: 'fizkulturno_sportivnoe',
    directions: [
      'Физкультурно-спортивная',
      'Общеразвивающая',
      'Предпрофессиональная',
      'Спортивная подготовка',
    ],
  },
  {
    focusName: 'Туристско-краеведческая',
    focusCode: 'turistsko_kraevedcheskoe',
    directions: [
      'Туристско-краеведческая',
      'Общеразвивающая',
      'Предпрофессиональная',
      'Спортивная подготовка',
    ],
  },
  {
    focusName: 'Техническая',
    focusCode: 'tekhnicheskoe',
    directions: ['Техническая', 'Общеразвивающая', 'Предпрофессиональная', 'Спортивная подготовка'],
  },
];

export const groupStub: Group = {
  uuid: 'uuid123',
  name: 'Группа 1 П-2 Ритмика П-2',
  ageFrom: 6.0,
  ageTo: 14.0,
  size: '15',
  dateBegin: '2020-10-14',
  dateEnd: '2021-05-31',
  hoursYear: 148.0,
  teachers: 'Думчиков Д. В.',
  schedule: 'Пн.12:00—14:00  <br> Ср.16:00—17:00  <br>Пт 17:00—15:30',
  financingSources: [
    { sourceCode: FinancialSourceType.pfdod_certificate, cost: 100, monthlyCost: 1500 },
    { sourceCode: FinancialSourceType.paid, cost: 120, monthlyCost: 1600 },
    { sourceCode: FinancialSourceType.private, cost: 130, monthlyCost: 1700 },
  ],
};

const municipality = { uuid: 'dfsdf', name: 'Муниципалитет1' };
export const municipalityStub = [
  municipality,
  municipality,
  municipality,
  municipality,
  municipality,
  municipality,
  municipality,
];
