import { Component, Input } from '@angular/core';
import { EgpuResponseQuestionsDisplayComponentAttrsActionsInterface } from '../interface/question-block.interface';

export interface IData extends EgpuResponseQuestionsDisplayComponentAttrsActionsInterface {
  hint: string;
}
@Component({
  selector: 'app-answer-choice',
  templateUrl: './answer-choice.component.html',
  styleUrls: ['./answer-choice.component.scss'],
})
export class AnswerChoiceComponent {
  @Input() data: Partial<IData>;
}
