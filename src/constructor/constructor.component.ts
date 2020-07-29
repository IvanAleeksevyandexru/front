import {Component} from '@angular/core';
import {SimpleComponentInterface} from '../constructor/interfaces/simple-component.interface';
import {QuestionAnswerInterface, QuestionBlockInterface} from './interfaces/question-block.interface';

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

  questionComponentData: QuestionBlockInterface = {
    header: 'Кого необходимо зарегистрировать?',
    supportedValues: [{
      label: 'Только меня',
      value: 'Только меня',
      action: 'getNextScreen'
    },
      {
        label: 'Меня и детей до 14 лет',
        value: 'Меня и детей до 14 лет',
        action: 'asdasdafgsadScreen'
      },
      {
        label: 'Только детей от 14 до 18',
        value: 'Только детей от 14 до 18',
        action: 'snahdgjadkafgas'
      },
      {
        label: 'Всю семью',
        value: 'Всю семью',
        action: 'snahdgjadkafgas'
      }
    ],
  };

  onAnswerSelect(data: QuestionAnswerInterface) {
    console.log(data);
  }


  confirmUserEmail = {
    "id": "pd3",
    "type": "ConfirmUserEmail",
    "header": "Подтвердите адрес электронной почты",
    "label": "электронная почта",
    "image": "",
    "content": 'electropochta@electropochta.ru', // TODO отсебятина, удалить после определения структуры данных
    "supportedValues": [],
    "actions": [{"label": "Изменить", "method": "editPersonalEmail"}],
    "fields": [],
    "visited": false
  }

  confirmEmailActionSelect($event: any) {
    console.log($event);
  }


  confirmPhoneEmail = {
    "id": "pd2",
    "type": "ConfirmUserPhone",
    "header": "Подтвердите контактный телефон",
    "label": "контактный телефон",
    "content": '+7 (999) 999-99-99', // TODO отсебятина, удалить после определения структуры данных
    "supportedValues": [],
    "attrs": {"actions": [{"label": "Изменить", "method": "editPersonalPhone"}, {"label": "Верно", "method": "phoneCorrect"}]},
    "visited": false
  }

  confirmPhoneActionSelect($event: any) {
    console.log($event);
  }


}
