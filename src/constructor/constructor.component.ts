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
    label: '<p>Вы переехали на новое место, хотите зарегистрировать себя у родственников или хотиие прекратитть регистрацию - воспользуейтесь данной услугой...</p>',
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
}
