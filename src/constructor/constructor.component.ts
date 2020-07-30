import { Component } from '@angular/core';
import { SimpleComponentInterface } from '../app/interfaces/simple-component.interface';
import { ConfirmUserDataInterface } from '../app/interfaces/confirm-user-data.interface';
import {
  QuestionAnswerInterface,
  QuestionBlockInterface,
} from '../app/interfaces/question-block.interface';

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.scss'],
})
export class ConstructorComponent {
  // WelcomeComponent <start>
  welcomeComponentData: SimpleComponentInterface = {
    header: 'Регистрация и снятие с регистрации по месту пребывания',
    label:
      'Вы переехали на новое место, хотите зарегистрировать себя у родственников или прекратить регистрацию – воспользуйтесь данной услугой.<br><br>' +
      'По законодательству не требуется регистрироваться на срок пребывания \n' +
      'менее 90 дней. \n' +
      '<br><br>' +
      'Вам нужно ответить на несколько вопросов, чтобы мы показали необходимые действия.\n',
    submitButtonLabel: 'Продолжить',
  };
  // WelcomeComponent <end>

  // RequirementsListComponentData <end>
  requirementsListComponentData: SimpleComponentInterface = {
    header: 'Для подачи заявления вам потребуется:',
    label:
      '<ul><li>Паспортные данные всех взрослых членов семьи, включая детей старше 14 лет</li><li>Данные свидетельств о рождении для детей до 14 лет</li><li>Паспортные данные собственников жилья</li></ul><p>После подачи заявления все взрослые члены семьи и собственники жилого помещения должны подтвердить свое согласие на временную регистрацию через личный кабинет портала Госуслуг</p><p>Для получения бумажной копии свидетельства о регистрации сделайте соответствующую пометку в заявлении либо обратитесь в ближайший МФЦ</p>',
    submitButtonLabel: 'Перейти к заявлению',
  };
  // RequirementsListComponentData <end>

  // confirmPersonalUserData <end>
  confirmUserData: SimpleComponentInterface = {
    header: 'Подтвердите корректность ваших данных',
    label: '',
    submitButtonLabel: 'Верно',
  };
  // confirmPersonalUserData <end>

  questionComponentData: QuestionBlockInterface = {
    header: 'Кого необходимо зарегистрировать?',
    supportedValues: [
      {
        label: 'Только меня',
        value: 'Только меня',
        action: 'getNextScreen',
      },
      {
        label: 'Меня и детей до 14 лет',
        value: 'Меня и детей до 14 лет',
        action: 'asdasdafgsadScreen',
      },
      {
        label: 'Только детей от 14 до 18',
        value: 'Только детей от 14 до 18',
        action: 'snahdgjadkafgas',
      },
      {
        label: 'Всю семью',
        value: 'Всю семью',
        action: 'snahdgjadkafgas',
      },
    ],
  };

  confirmUserEmail = {
    id: 'pd3',
    type: 'ConfirmUserEmail',
    header: 'Подтвердите адрес электронной почты',
    label: 'электронная почта',
    image: '',
    content: 'electropochta@electropochta.ru', // TODO отсебятина, удалить после определения структуры данных
    supportedValues: [],
    actions: [{ label: 'Верно', method: 'getNextStep' }],
    fields: [],
    visited: false,
  };

  confirmPhoneEmail = {
    id: 'pd2',
    type: 'ConfirmUserPhone',
    header: 'Подтвердите контактный телефон',
    label: 'контактный телефон',
    content: '+7 (999) 999-99-99', // TODO отсебятина, удалить после определения структуры данных
    supportedValues: [],
    attrs: {
      actions: [
        { label: 'Верно', method: 'getNextStep' },
        { label: 'Изменить', method: 'editPersonalPhone' },
      ],
    },
    visited: false,
  };

  userPersonalData: ConfirmUserDataInterface = {
    id: 'pd5',
    type: 'ConfirmPersonalUserData',
    label: '',
    attrs: {
      actions: [
        { label: 'Верно', method: 'getNextStep' },
        { label: 'Изменить', method: 'editPersonalUserData' },
      ],
      fields: [
        { fieldName: 'firstName', label: 'Имя' },
        { fieldName: 'lastName', label: 'Фамилия' },
        { fieldName: 'middleName', label: 'Отчество' },
        { fieldName: 'birthDate', label: 'Дата рождения' },
        { fieldName: 'birthPlace', label: 'Место рождения' },
        { fieldName: 'rfPasportSeries', label: 'Серия паспорта' },
        { fieldName: 'rfPasportNumber', label: 'Номер паспорта' },
        { fieldName: 'rfPasportIssueDate', label: 'Дата выдачи' },
        { fieldName: 'rfPasportIssuedBy', label: 'Кем выдан' },
        { fieldName: 'rfPasportIssuedById', label: 'Код подразделения' },
      ],
    },
    value:
      '{"firstName":"Константин","lastName":"Константинопольский","middleName":"Александрович","birthDate":"15.06.1989","birthPlace":"п. Верхняя Салда Свердловской области","rfPasportSeries":"0000","rfPasportNumber":"123456","rfPasportIssueDate":"18.06.2009","rfPasportIssuedBy":"УВД Ленинского района г. Москвы","rfPasportIssuedById":"111-222"}',
    visited: true,
  };

  confirmPhoneAddress = {
    id: 'pd4',
    type: 'ConfirmUserRegistrationAddr',
    header: 'Подтвердите адрес постоянной регистрации',
    label: '',
    image: '',
    supportedValues: [
      {
        title: 'Адрес',
        content: 'г. Москва, Варшавское ш., д. 141А, корп. 3, кв. 999',
      },
      { title: 'Дата регистрации', content: '01.01.2018' },
    ],
    actions: [
      { label: 'Верно', method: 'getNextStep' },
      { label: 'Нет адреса постоянной регистрации', method: 'skip' },
    ],
    fields: [],
    visited: false,
  };

  onAnswerSelect(data: QuestionAnswerInterface): void {
    console.log(data);
  }

  confirmEmailActionSelect($event: any): void {
    console.log($event);
  }

  confirmUserDataActionSelect($event: any): void {
    console.log($event);
  }

  confirmAddressActionSelect($event: any): void {
    console.log($event);
  }

  confirmPhoneActionSelect($event: any): void {
    console.log($event);
  }
}
