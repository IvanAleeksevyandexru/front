import {asNativeElements, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuestionAnswerInterface, QuestionISrcInterface} from "../../interfaces/questionI-src.interface";

@Component({
  selector: 'question-block',
  templateUrl: './questions-block.component.html',
  styleUrls: ['./questions-block.component.scss']
})
export class QuestionsBlockComponent implements OnInit {

  @Input() data: QuestionISrcInterface;

  @Output() onAnswerSelect = new EventEmitter<QuestionAnswerInterface>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onAnswerChoose(answer: QuestionAnswerInterface) {
    this.onAnswerSelect.emit(answer)
  }
}

