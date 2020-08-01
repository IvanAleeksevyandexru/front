import { Component } from '@angular/core';
<<<<<<< HEAD
import { SimpleComponentInterface } from '../app/interfaces/simple-component.interface';
import { ConfirmUserDataInterface } from '../app/interfaces/confirm-user-data.interface';
import {
  QuestionAnswerInterface,
  QuestionBlockInterface,
} from '../app/interfaces/question-block.interface';
=======
import {QuestionAnswerInterface} from '../app/interfaces/question-block.interface';
import {EpguService} from '../services/epgu.service';
import {COMPONENT_TYPE} from '../app/constant/global';
import {EgpuResponseInterface} from '../app/interfaces/epgu.service.interface';
>>>>>>> ef358ca... [EPGU-267]

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.scss'],
})
export class ConstructorComponent {

  // <--constant
  constructorComponentType = COMPONENT_TYPE;

<<<<<<< HEAD
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
=======
  // <-- variable
  response: EgpuResponseInterface;
  componentId: string;
  componentType: string;
  componentData: any;

  constructor(
    public epguService: EpguService,
  ) { }

  ngOnInit(): void {
    this.epguService.getData().subscribe((response) => {
      this.initResponse(response);
    }, (error) => {
      console.error(error);
    });
  }

  initResponse(response): void {
    // this.response = {};
    this.response = response;
    const { display } = response;
    this.componentId = display.components[0].id;
    this.componentType = display.components[0].type;
    this.componentData = display;
    console.log('----- GET DATA ---------');
    console.log('componentId:', this.componentId);
    console.log('componentType:', this.componentType);
    console.log('initResponse:', display);
  }

  sendData(data) {
    this.response.currentValue[this.componentId] = {visited: true, value: data};
    this.epguService.setData(this.response).subscribe((response) => {
      console.log('----- SET DATA ---------');
      console.log('request', this.response)
      this.initResponse(response);
    }, (error) => {
      console.error(error);
    });
  }

  nextStep() {
    this.sendData(true);
>>>>>>> ef358ca... [EPGU-267]
  }

  onAnswerSelect(data: QuestionAnswerInterface) {
    this.sendData(data.value);
  }
}
