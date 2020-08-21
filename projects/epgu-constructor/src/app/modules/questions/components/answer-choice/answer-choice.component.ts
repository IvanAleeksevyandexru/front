import { Component, Input, OnInit } from '@angular/core';
import { EgpuResponseQuestionsDisplayComponentAttrsActionsInterface } from '../interface/question-block.interface';

interface IData extends EgpuResponseQuestionsDisplayComponentAttrsActionsInterface {
  hint: string;
}
@Component({
  selector: 'app-answer-choice',
  templateUrl: './answer-choice.component.html',
  styleUrls: ['./answer-choice.component.scss'],
})
export class AnswerChoiceComponent implements OnInit {
  @Input()
  data: Partial<IData>;

  ngOnInit(): void {}
}
