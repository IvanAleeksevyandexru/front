import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuestionAnswerInterface, QuestionBlockInterface} from '../../../../interfaces/question-block.interface';
import {EgpuResponseDisplayInterface} from '../../../../interfaces/epgu.service.interface';

@Component({
  selector: 'app-question-screen',
  templateUrl: './questions-screen.component.html',
  styleUrls: ['./questions-screen.component.scss']
})
export class QuestionsScreenComponent implements OnInit {

  @Input() data: EgpuResponseDisplayInterface;
  @Output() answerSelect = new EventEmitter<QuestionAnswerInterface>();

  constructor() {
  }

  ngOnInit(): void {
  }

  answerChoose(answer: QuestionAnswerInterface): void {
    this.answerSelect.emit(answer);
  }
}

