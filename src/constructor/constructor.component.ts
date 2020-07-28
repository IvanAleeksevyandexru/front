import {Component} from '@angular/core';
import {SimpleComponentInterface} from '../constructor/interfaces/simple-component.interface';
import {QuestionAnswerInterface, QuestionISrcInterface} from "./interfaces/questionI-src.interface";

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
  }
  // WelcomeComponent <end>

  // questionComponentData: QuestionISrcInterface = {
  //   "header": "Кого необходимо зарегистрировать?",
  //   "supportedValues": [{
  //     "label": "Только меня",
  //     "value": "Только меня",
  //     "action": "getNextScreen"
  //   },
  //     {
  //       "label": "Меня и детей до 14 лет",
  //       "value": "Меня и детей до 14 лет",
  //       "action": "asdasdafgsadScreen"
  //     },
  //     {
  //       "label": "Только детей от 14 до 18",
  //       "value": "Только детей от 14 до 18",
  //       "action": "snahdgjadkafgas"
  //     },
  //     {
  //       "label": "Всю семью",
  //       "value": "Всю семью",
  //       "action": "snahdgjadkafgas"
  //     }
  //   ],
  // }
  //
  // onAnswerSelect(data: QuestionAnswerInterface) {
  //   console.log(data)
  // }
}
