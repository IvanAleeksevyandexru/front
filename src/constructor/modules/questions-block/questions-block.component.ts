import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuestionAnswerInterface, QuestionBlockInterface} from '../../interfaces/question-block.interface';

@Component({
  selector: 'question-block',
  templateUrl: './questions-block.component.html',
  styleUrls: ['./questions-block.component.scss']
})
export class QuestionsBlockComponent implements OnInit {

  @Input() data: QuestionBlockInterface;

  @Output() onAnswerSelect = new EventEmitter<QuestionAnswerInterface>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onAnswerChoose(answer: QuestionAnswerInterface) {
    this.onAnswerSelect.emit(answer)
  }
}

