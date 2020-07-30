import {Component} from '@angular/core';
import {SimpleComponentInterface} from '../constructor/interfaces/simple-component.interface';
import {QuestionAnswerInterface, QuestionBlockInterface} from './interfaces/question-block.interface';
import {EpguService} from '../services/epgu.service';

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.scss']
})
export class ConstructorComponent {
  // WelcomeComponent <start>
  welcomeComponentData: SimpleComponentInterface = {
    header: 'Регистрация и снятие с регистрации по месту пребывания',
    label: 'Вы переехали на новое место, хотите зарегистрировать себя у родственников или прекратить регистрацию – воспользуйтесь данной услугой.<br><br>' +
      'По законодательству не требуется регистрироваться на срок пребывания \n' +
      'менее 90 дней. \n' +
      '<br><br>' +
      'Вам нужно ответить на несколько вопросов, чтобы мы показали необходимые действия.\n',
    submitButtonLabel: 'Продолжить'
  };
  // WelcomeComponent <end>

  // RequirementsListComponentData <end>
  requirementsListComponentData: SimpleComponentInterface = {
    header: 'Для подачи заявления вам потребуется:',
    label: '<ul><li>Паспортные данные всех взрослых членов семьи, включая детей старше 14 лет</li><li>Данные свидетельств о рождении для детей до 14 лет</li><li>Паспортные данные собственников жилья</li></ul><p>После подачи заявления все взрослые члены семьи и собственники жилого помещения должны подтвердить свое согласие на временную регистрацию через личный кабинет портала Госуслуг</p><p>Для получения бумажной копии свидетельства о регистрации сделайте соответствующую пометку в заявлении либо обратитесь в ближайший МФЦ</p>',
    submitButtonLabel: 'Перейти к заявлению'
  };
  // RequirementsListComponentData <end>

  response: any;
  componentId: string;
  componentType: string;
  componentData: any;

  constructor(
    public epguService: EpguService,
  ) { }

  welcomeNextStep(value) {
    this.sendData(true);
  }

  onAnswerSelect(data: QuestionAnswerInterface) {
    this.sendData(data.value);
  }

  initResponse(response): void {
    this.response = {};
    this.response = response;
    const { display } = response;
    this.componentId = display.components[0].id;
    this.componentType = display.components[0].type;
    this.componentData = display;
    console.log('--------------');
    console.log('componentId:', this.componentId);
    console.log('componentType:', this.componentType);
    console.log('initResponse:', display);
  }

  ngOnInit(): void {
    this.epguService.getData().subscribe((response) => {
      this.initResponse(response);
    }, (error) => {
      console.error(error);
    });
  }


  confirmPhoneEmail = {
    "id": "pd2",
    "type": "ConfirmUserPhone",
    "header": "Подтвердите контактный телефон",
    "label": "контактный телефон",
    "content": '+7 (999) 999-99-99', // TODO отсебятина, удалить после определения структуры данных
    "supportedValues": [],
    "attrs": {
      "actions": [{"label": "Изменить", "method": "editPersonalPhone"}, {
        "label": "Верно",
        "method": "phoneCorrect"
      }]
    },
    "visited": false
  sendData(data) {
    this.response.currentValue[this.componentId] = {visited: true, value: data};
    this.epguService.setData(this.response).subscribe((response) => {
      this.initResponse(response);
    }, (error) => {
      console.error(error);
    });
  }

  confirmPhoneActionSelect($event: any) {
    console.log($event);
  }

  confirmPhoneAddress = {
    "id": "pd4",
    "type": "ConfirmUserRegistrationAddr",
    "header": "Подтвердите адрес постоянной регистрации",
    "label": "",
    "image": "",
    "supportedValues": [{
      title: 'Адрес',
      content: 'г. Москва, Варшавское ш., д. 141А, корп. 3, кв. 999'
    }, {title: 'Дата регистрации', content: '01.01.2018'}],
    "actions": [{
      "label": "Изменить",
      "method": "editPersonalRegistrationAddr"
    }, {"label": "Нет адреса постоянной регистрации", "method": "skip"}],
    "fields": [],
    "visited": false
  }

  confirmAddressActionSelect($event: any) {
    console.log($event);
  }


}
