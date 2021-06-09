import { Project } from '../typings';
import { Clarifications } from '@epgu/epgu-constructor-types';

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
