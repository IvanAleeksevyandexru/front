import {Component, Input, OnInit} from '@angular/core';
import {QuestionAnswerInterface} from '../../../../interfaces/question-block.interface';

@Component({
  selector: 'app-answer-choice',
  templateUrl: './answer-choice.component.html',
  styleUrls: ['./answer-choice.component.scss']
})
export class AnswerChoiceComponent implements OnInit {

  @Input()
  data: QuestionAnswerInterface;
  constructor() { }

  ngOnInit(): void {
  }

}
