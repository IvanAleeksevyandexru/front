import {asNativeElements, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuestionAnswerInterface, QuestionISrcInterface} from "../../interfaces/questionI-src.interface";

@Component({
  selector: 'question-block',
  templateUrl: './questions-block.component.html',
  styleUrls: ['./questions-block.component.scss']
})
export class QuestionsBlockComponent implements OnInit {

  @Input() data: QuestionISrcInterface = {
    "header": "Ваша цель?",
    "supportedValues": [{
      "label": "Прекратить регистрацию",
      "value": "Прекратить регистрацию",
      "action": "getNextScreen"
    },
      {
        "label": "Продолжить регистрацию",
        "value": "Продолжить регистрацию",
        "action": "asdasdafgsadScreen"
      },
      {
        "label": "Отмена",
        "value": "Отмена",
        "action": "snahdgjadkafgas"
      }
    ],
  }

  @Output() onAnswerChoose = new EventEmitter<QuestionAnswerInterface>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onAnswerSelect(answer: QuestionAnswerInterface) {
    this.onAnswerChoose.emit(answer)
  }
}

