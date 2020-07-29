import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuestionAnswerInterface, QuestionBlockInterface} from '../../interfaces/question-block.interface';

@Component({
  selector: 'app-question-block',
  templateUrl: './questions-block.component.html',
  styleUrls: ['./questions-block.component.scss']
})
export class QuestionsBlockComponent implements OnInit {

  @Input() data: QuestionBlockInterface;

  @Output() answerSelect = new EventEmitter<QuestionAnswerInterface>();

  constructor() {
  }

  ngOnInit(): void {
  }

  answerChoose(answer: QuestionAnswerInterface): void {
    this.answerSelect.emit(answer);
  }
}

